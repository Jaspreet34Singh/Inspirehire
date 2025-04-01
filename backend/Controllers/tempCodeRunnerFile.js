import schedule from 'node-schedule';

const testDate = new Date(Date.now() + 10 * 1000); // 10 seconds from now
schedule.scheduleJob(testDate, () => {
    console.log("🔥 Test job executed!");
});
console.log("Test job scheduled for 10 seconds later.");
