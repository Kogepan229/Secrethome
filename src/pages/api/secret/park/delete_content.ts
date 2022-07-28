import type { NextApiRequest, NextApiResponse } from 'next';
import { ulid } from 'ulid';
import formidable from "formidable"
import fs from "fs"
import { exec } from 'child_process';

import { DB } from 'util/sql';
import { GetNowTime } from 'util/time';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.socket.remoteAddress)

  if (req.method === 'DELETE') {
      console.log("delete id:", req.body.id)
      // TODO id check
      await new Promise<void>((resolve) => {
        // delete content
        DB.query(`delete from park_contents where id='${req.body.id}'`)
        // delete content tags
        DB.query(`delete from park_tags_of_contents where content_id='${req.body.id}'`)
        resolve()
      }).then(() => {
        fs.rename(`${process.env.FILE_DIRECTORY_PATH}/contents/${req.body.id}/${req.body.id}.mp4`, `${process.env.FILE_DIRECTORY_PATH}/deleted/${req.body.id}.mp4`, (err) => {
          if (err) {
            throw err
          }
        })
      }).then(() => {
        fs.rm(`${process.env.FILE_DIRECTORY_PATH}/contents/${req.body.id}`, { recursive: true, force: true }, () => {
        });
      }).then(() => {
        res.status(200).json({ result: 'success' });
      }).catch(err => {
        console.error(err)
        res.status(200).json({ result: 'server error' });
      })
  }
};

export default handler;