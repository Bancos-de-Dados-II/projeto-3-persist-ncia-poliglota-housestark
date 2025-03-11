import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL, 
    password: process.env.REDIS_PASSWORD, 
});

redisClient.on("error", (err) => console.error("Erro no Redis:", err));

redisClient.connect()
    .then(() => console.log("✅ Conectado ao Redis Cloud"))
    .catch(console.error);

export default redisClient;