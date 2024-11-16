import type { NextApiRequest, NextApiResponse } from 'next'
import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, action } = req.query

  if (req.method === 'POST') {
    try {
      const container = docker.getContainer(id as string)
      if (action === 'start') {
        await container.start()
      } else if (action === 'stop') {
        await container.stop()
      } else {
        throw new Error('Invalid action')
      }
      res.status(200).json({ message: `Docker service ${action}ed successfully` })
    } catch (error) {
      res.status(500).json({ error: `Failed to ${action} Docker service` })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}