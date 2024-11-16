import type { NextApiRequest, NextApiResponse } from 'next'
import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const containers = await docker.listContainers({ all: true })
      res.status(200).json(containers)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch Docker services' })
    }
  } else if (req.method === 'POST') {
    try {
      const { image, name, port } = req.body
      await docker.createContainer({
        Image: image,
        name: name,
        ExposedPorts: { [`${port}/tcp`]: {} },
        HostConfig: {
          PortBindings: { [`${port}/tcp`]: [{ HostPort: port }] },
        },
      })
      res.status(201).json({ message: 'Docker service created successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to create Docker service' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}