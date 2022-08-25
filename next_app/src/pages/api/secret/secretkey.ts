// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { DB } from 'util/sql'




const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (req.body.key === "256489") {
      res.status(200).json({url: "/secret/park/contents/"})
      return
    }
  }
  res.status(200).json({url: "/"})
}

export default handler