import type { NextApiRequest, NextApiResponse } from 'next'
import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const container = docker.getContainer(id as string)
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        tail: 100,
      })
      res.status(200).send(logs)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch Docker service logs' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}