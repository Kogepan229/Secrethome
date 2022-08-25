import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from "formidable"
import fs from "fs"
import { DB } from 'util/sql';
import { GetNowTime } from 'util/time';
import { exec } from 'child_process';
import { Tag } from 'util/secret/park/tags';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //console.log(req.socket.remoteAddress)

  if (req.method === 'POST') {
    let form = new formidable.Formidable({encoding: "utf-8", uploadDir: "./tmp", maxFileSize: 1024 * 1024 * 1024 * 4});
    //let g: any

    let id: string;
    let title: string;
    let description: string;
    let tagIDs: string[];
    let filePath: string;
    let imageBase64: string;
    await new Promise<void>((resolve) => {
      form.parse(req, (err, fields, files) => {
        id = fields.id as string;
        title = fields.title as string;
        description = fields.description as string;
        tagIDs = JSON.parse(fields.tags as string)
        //console.log(tagIDs)
        imageBase64 = fields.image as string;

        if (files.movie !== undefined) {
          filePath = (files.movie as any)._writeStream.path
        }
        resolve()
      })
    }).then(() => {
      if (id == "" || id == undefined || title == undefined || description == undefined) {
        throw "invalid request"
      }

    }).then(() => {
      let updated_at = GetNowTime()
      //console.log("id: " + id)
      DB.query(`update park_contents set title='${title}', description='${description}', updated_at='${updated_at}' where id='${id}'`)

      // delete tags
      DB.query(`delete from park_tags_of_contents where content_id='${id}'`)
      // insert tags again
      for (let i = 0; i < tagIDs.length; i++) {
        DB.query(`insert into park_tags_of_contents values ('${id}', '${tagIDs[i]}', ${i})`);
      }
      /*
      tagIDs.forEach(value => {
        DB.query(`insert into park_tags_of_contents values ('${id}', '${value}')`);
      })
      */

      console.log("update info", id)
    }).then(() => {
      //id = ulid()
      if (filePath !== undefined) {
        // TODO Imageが消えないようにする
        fs.rmdirSync(`${process.env.FILE_DIRECTORY_PATH}/contents/${id}`)
        fs.mkdirSync(process.env.FILE_DIRECTORY_PATH + "/contents/" + id)

        fs.copyFileSync(filePath, `${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}.mp4`)
        fs.unlinkSync(filePath)

        /*
        fs.rename(filePath, `${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}.mp4`, (err) => {
          if (err) {
            console.error(err)
          }
        })
        */
      }
    }).then(() =>{
      if (imageBase64 && imageBase64 !== "") {
        fs.rmSync(`${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}.webp`)
        const image = Buffer.from(imageBase64.split(',')[1], 'base64');
        fs.writeFile(`${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}.webp`, image, err => {
          if (err) {
            console.log('id:', id);
            console.error(err);
          } else {
            console.log("update image id:", id)
          }
        });
      }
    }).then(() => {
      if (filePath !== undefined) {
        exec(`sh ${process.env.FILE_DIRECTORY_PATH}/contents/convert.sh ${process.env.FILE_DIRECTORY_PATH}/contents/${id}/${id}`, (err) => {
          if (err) {
            console.error(err)
          } else {
            console.log("update movie", id)
          }
        })
      }
    }).then(() => {
      res.status(200).json({ result: 'success', id: id });
    }).catch((err) => {
      console.log("err:", err)
      if (err === "invalid request") {
        res.status(400).json({ result: 'invalid request' })
        return;
      }

      fs.unlink(filePath, () => {

      })
      res.status(400).json({ result: 'invalid request' })
      return
    })





    /*
    let title = req.body.title;
    let description = req.body.description;
    let created_at = GetNowTime()
    //console.log(`title: ${title}, desc: ${description}`)

    await DB.query(`insert into park_contents values ('${ulid()}', '${title}', '${description}', '${created_at}', '${created_at}')`)
    console.log("add")

    res.status(200).json({ result: 'seccess' });
    */
  }
  //res.status(400);
};

export default handler;