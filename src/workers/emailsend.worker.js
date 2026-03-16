import { Worker } from "bullmq";
import sendEmail from "../utils/sendEmail.js";


new Worker("email-send", async (job) => {

    console.log("Email worker started...");
    console.log(job);

    const { clientEmail, pdf, adminEmail } = job.data;

    // send email to the admin
    await sendEmail([clientEmail, adminEmail], pdf);


},
    {
        concurrency: 3, // Process 3 products in parallel
        connection: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        },
    }
);


worker.on("completed", job => {
    console.log(`Job completed ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.log(`Job failed ${job.id}`, err);
});