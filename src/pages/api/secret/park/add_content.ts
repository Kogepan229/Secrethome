import type { NextApiRequest, NextApiResponse } from 'next';
import { ulid } from 'ulid';
import formidable from 'formidable';
import fs from 'fs';
import { exec } from 'child_process';

import { DB } from 'util/sql';
import { GetNowTime } from 'util/time';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.socket.remoteAddress);

  if (req.method === 'POST') {
    let form = new formidable.Formidable({ encoding: 'utf-8', uploadDir: './tmp', maxFileSize: 1024 * 1024 * 1024 * 4 });
    //let g: any

    let title: string;
    let description: string;
    let tagIDs: string[];
    let filePath: string;
    let imageBase64: string;
    let id: string;
    await new Promise<void>(resolve => {
      form.parse(req, (err, fields, files) => {
        title = fields.title as string;
        description = fields.description as string;
        tagIDs = JSON.parse(fields.tags as string)
        //console.log(tagIDs)
        imageBase64 = fields.image as string;

        //console.log(fields);
        //console.log((files.movie as any)._writeStream.path);
        //console.log(fields)
        filePath = (files.movie as any)._writeStream.path;
        //console.log(err)
        //g = err;
        resolve();
      });
    }).then(() => {
      id = ulid();
      fs.mkdirSync(process.env.FILE_DIRECTORY_PATH + '/contents/' + id);
      fs.rename(filePath, `${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}.mp4`, err => {
        if (err) {
          console.log('id:', id);
          console.error(err);
        }
      });

      const image = Buffer.from(imageBase64.split(',')[1], 'base64');
      //console.log(image)
      fs.writeFile(`${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}.webp`, image, err => {
        if (err) {
          console.log('id:', id);
          console.error(err);
        }
      });

      let created_at = GetNowTime();
      //console.log("id: " + id)
      DB.query(`insert into park_contents values ('${id}', '${title}', '${description}', '${created_at}', '${created_at}')`);

      tagIDs.forEach(value => {
        DB.query(`insert into park_tags_of_contents values ('${id}', '${value}')`);
      })


    }).then(() => {
      exec(`sh ${process.env.FILE_DIRECTORY_PATH}/contents/convert.sh ${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}`, err => {
        if (err) {
          console.log('id:', id);
          console.error(err);
        }
      });
    }).then(() => {
      res.status(200).json({ result: 'success', id: id });
    }).catch(err => {
      console.log('id:', id);
      console.log(err);
      fs.unlink(filePath, () => {});
      res.status(200).json({ result: 'server error'});
      return;
    });
  }
  //res.status(400);
};

export default handler;
