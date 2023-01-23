// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (req.body.key === '256489') {
      res.status(200).json({ url: '/park/contents/' })
      return
    }
  }
  res.status(200).end()
}

export default handler
