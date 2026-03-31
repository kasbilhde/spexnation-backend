import { Worker } from "bullmq";
import { sendEmail } from "../utils/sendEmail.js";


new Worker("email-send", async (job) => {


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

        // ✅ CLEANUP SETTINGS
        removeOnComplete: true, // removes job immediately after success
        removeOnFail: 5,       // keep last 5 failed jobs (for debugging)
    }
);


worker.on("completed", job => {
    console.log(`Job completed ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.log(`Job failed ${job.id}`, err);
});