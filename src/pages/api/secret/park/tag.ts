import type { NextApiRequest, NextApiResponse } from 'next';
import { ulid } from 'ulid';
import formidable from "formidable"
import fs from "fs"
import { exec } from 'child_process';

import { DB } from 'util/sql';
import { GetNowTime } from 'util/time';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.socket.remoteAddress)

  if (req.method === 'POST') {
      //console.log("name:", req.body.name)

      // TODO id check
      await new Promise<any>(async (resolve, reject) => {
        if (!req.body.name) {
          reject("Name is empty or undefined")
          return
        }

        let result1 = await DB.query<any[]>(`select count(*) from park_tags where name='${req.body.name}'`);
        if (result1[0]['count(*)'] > 0) {
          reject("Already exists")
        }

        let result2 = await DB.query<any[]>(`select count(*) from park_tags`);
        //console.log(result1[0]['count(*)'])
        //DB.query(`delete from park_contents where id='${req.body.id}'`)
        if (result2[0]['count(*)'] == undefined) {
          reject("Failed get tag number.")
        }
        let id = ulid()
        let priority = result2[0]['count(*)'] + 1
        await DB.query<any[]>(`insert into  park_tags values ('${id}', ${priority}, '${req.body.name}')`);
        resolve({id: id, priority: priority, name: req.body.name})

      }).then(value => {
        res.status(200).json({ result: 'success', id: value.id, priority: value.priority, name: value.name});
      }).catch(reason => {
        console.log(reason)
        res.status(200).json({ result: reason})
      })
  }
};

export default handler;