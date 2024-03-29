import { createConnection } from 'mysql2/promise'

export const getDBConnection = async () => {
  return await createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  })
}
