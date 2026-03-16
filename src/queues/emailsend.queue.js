import dotenv from "dotenv";
dotenv.config();


import { Queue } from "bullmq";


console.log("process.env.REDIS_HOST", process.env.REDIS_HOST);


export const emailSendQueue = new Queue("email-send", {
    connection: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
    },
});
