// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (req.body.key === "256489") {
      //res.redirect(302, "/secret/park")
      res.status(200).json({url: "/secret/park"})
      return
    }
  }
  res.status(200).json({url: "/"})
}

export default handler