import mysql from "mysql2/promise";
import GetDBSettings from "./DBSettings";

// Create a connection pool
const dbConnectionPool = mysql.createPool(GetDBSettings());

export default dbConnectionPool;
