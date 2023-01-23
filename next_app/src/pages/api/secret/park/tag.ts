import type { NextApiRequest, NextApiResponse } from 'next'
import { ulid } from 'ulid'
import { DB } from 'util/sql'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.socket.remoteAddress)

  if (req.method === 'POST') {
    // TODO id check
    await new Promise<any>(async (resolve, reject) => {
      if (!req.body.name) {
        reject('Name is empty or undefined')
        return
      }

      let result1 = await DB.query<any[]>(`select count(*) from park_tags where name='${req.body.name}'`)
      if (result1[0]['count(*)'] > 0) {
        reject('Already exists')
        return
      }

      let result2 = await DB.query<any[]>(`select count(*) from park_tags`)
      if (result2[0]['count(*)'] == undefined) {
        reject('Failed get tag number.')
        return
      }
      let id = ulid()
      await DB.query<any[]>(`insert into  park_tags values ('${id}', '${req.body.name}')`)
      resolve({ id: id, name: req.body.name })
    })
      .then(value => {
        res.status(200).json({ result: 'success', id: value.id, name: value.name })
      })
      .catch(reason => {
        console.log(reason)
        res.status(200).json({ result: reason })
      })
  }
}

export default handler
