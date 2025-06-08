import cron from 'node-cron';


export const registerCronJobs = (client) => {
    cron.schedule('* * * * *', async () => {
        try {
            return;
            const user = await client.users.fetch('[user_id_goes_here]');
            await user.send('hey sraLton toBton-cronjob here');
        } catch (error) {
            console.error('Failed to send dm: ', error);
        }
    })
}
