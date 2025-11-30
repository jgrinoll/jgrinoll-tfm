import mysql from "mysql2";
import { ConnectionOptions } from "mysql2";

const GetDBSettings = (): ConnectionOptions => {
  // In this case, we do not have a development database, so development is done on production.
  switch (process.env.NODE_ENV) {
    case "development":
    case "production":
    case "test":
      return {
        host: process.env.MYSQL_HOST!,
        port: parseInt(process.env.MYSQL_PORT!),
        user: process.env.MYSQL_USER!,
        password: process.env.MYSQL_PASSWORD!,
        database: process.env.MYSQL_DATABASE!,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      };
  }
};

export default GetDBSettings;
