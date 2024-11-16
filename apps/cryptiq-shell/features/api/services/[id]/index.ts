import type { NextApiRequest, NextApiResponse } from 'next'
import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      const container = docker.getContainer(id as string)
      await container.remove({ force: true })
      res.status(200).json({ message: 'Docker service removed successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove Docker service' })
    }
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}