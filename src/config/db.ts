import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import seedAll from "./seed";

dotenv.config();
console.log(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD);

const sequelize = new Sequelize(
    process.env.POSTGRES_DB as string,
    process.env.POSTGRES_USER as string,
    process.env.POSTGRES_PASSWORD as string,
    {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        dialect: "postgres",
        logging: false
    }
);

export async function checkDB(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log("Conexión a la BBDD establecida correctamente.");
    } catch (error) {
        console.error("No se ha conectado a la BBDD.", error);
        throw error;
    }
}

export async function syncDB(): Promise<void> {
    try {
        await sequelize.sync({ alter: true });
        console.log("BBDD sincronizada.");
    } catch (error) {
        console.error("No se ha podido sincronizar", error);
        throw error;
    }
}

export { sequelize };