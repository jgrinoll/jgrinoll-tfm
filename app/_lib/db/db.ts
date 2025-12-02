import "server-only";
import mysql, { Pool } from "mysql2/promise";
import GetDBSettings from "./DBSettings";

declare global {
  var dbConnectionPool: Pool | undefined;
}

const dbPool = new Proxy({} as Pool, {
  get(_, prop) {
    if (!globalThis.dbConnectionPool) {
      globalThis.dbConnectionPool = mysql.createPool(GetDBSettings());
    }
    return (globalThis.dbConnectionPool as unknown as Record<string, unknown>)[
      prop as string
    ];
  },
  apply() {
    if (!globalThis.dbConnectionPool) {
      globalThis.dbConnectionPool = mysql.createPool(GetDBSettings());
    }
    return globalThis.dbConnectionPool;
  },
});

export default dbPool;
