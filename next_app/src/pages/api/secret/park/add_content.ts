import type { NextApiRequest, NextApiResponse } from 'next'
import { ulid } from 'ulid'
import formidable from 'formidable'
import fs from 'fs'
import { exec } from 'child_process'

import { DB } from 'util/sql'
import { GetNowTime } from 'util/time'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //console.log(req.socket.remoteAddress);

  if (req.method === 'POST') {
    let form = new formidable.Formidable({ encoding: 'utf-8', uploadDir: './tmp', maxFileSize: 1024 * 1024 * 1024 * 10 })

    let title: string
    let description: string
    let tagIDs: string[]
    let filePath: string
    let imageBase64: string
    let id: string
    await new Promise<void>(resolve => {
      form.parse(req, (err, fields, files) => {
        if (err) console.log(err)

        title = fields.title as string
        description = fields.description as string
        tagIDs = JSON.parse(fields.tags as string)
        imageBase64 = fields.image as string
        filePath = (files.movie as any)._writeStream.path

        resolve()
      })
    })
      .then(() => {
        id = ulid()
        fs.mkdirSync(process.env.FILE_DIRECTORY_PATH + '/contents/' + id)
        fs.copyFileSync(filePath, `${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}.mp4`)
        fs.unlinkSync(filePath)

        const image = Buffer.from(imageBase64.split(',')[1], 'base64')
        fs.writeFile(`${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}.webp`, image, err => {
          if (err) {
            console.log('id:', id)
            console.error(err)
          }
        })

        let created_at = GetNowTime()
        DB.query(`insert into park_contents values ('${id}', '${title}', '${description}', '${created_at}', '${created_at}')`)

        for (let i = 0; i < tagIDs.length; i++) {
          DB.query(`insert into park_tags_of_contents values ('${id}', '${tagIDs[i]}', ${i})`)
        }
      })
      .then(() => {
        // maxBuffer Default 1024 * 1024
        exec(
          `sh ${process.env.FILE_DIRECTORY_PATH}/contents/convert.sh ${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}`,
          { maxBuffer: 1024 * 1024 * 10 },
          err => {
            if (err) {
              console.log('id:', id)
              console.error(err)
            }
          }
        )
      })
      .then(() => {
        res.status(200).json({ result: 'success', id: id })
      })
      .catch(err => {
        console.log('id:', id)
        console.log(err)
        fs.unlink(filePath, () => {})
        res.status(200).json({ result: 'server error' })
        return
      })
  }
}

export default handler
