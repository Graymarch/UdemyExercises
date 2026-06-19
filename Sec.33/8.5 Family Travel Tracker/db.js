//Import statements.
import pg from "pg";
import dotenv from "dotenv";

//Configures the environment file. 
dotenv.config({path: "./.env"});
let env = process.env;

//Creates a postgres connection pool.
const pool = new pg.Pool({
    user: env.USER,
    host: env.HOST,
    database: env.DATABASE,
    password: env.PASSWORD,
    port: env.PORT,
    max: 10,
    idleTimeoutMillis: 30000,
});

//Exports the Pool object.
export default pool