import JobPost from "../modules/job.model.js";
import User from "../modules/userModule.js";
import sequelize from "../config/database.js";



export const getEmailFromJobID = async (Job_ID) => {
    try {
        const results = await sequelize.query(
            `SELECT Email 
             FROM user 
             WHERE user_id = (
                 SELECT user_id 
                 FROM job_post 
                 WHERE Job_ID = :jobId
             )`,
            {
                replacements: { jobId: Job_ID },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Extract email
        if (results.length === 0) {
            return { success: false, message: "Job not found" };
        }

        const email = results[0].Email;
        
        return {
            success: true,
            email: email
        };
    }
        catch(error){
            console.error("Error form email controller" + error);
        }
}



export const getApplicationDeadline = async (Job_ID) => {
    try {
        const results = await sequelize.query(
            `SELECT Job_deadline
            from job_post
            where job_id = :jobId`,
            {
                replacements: { jobId: Job_ID },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (results.length === 0) {
            return { success: false, message: "Job not found" };
        }

        const deadline = results[0].Job_deadline;
        
        return {
            success: true,
            job_deadline: deadline
        };
    }
        catch(error){
            console.error("Error form email controller" + error);
        }
}