const express = require('express');
const app = express();
const cors = require('cors');
const cron = require('cron');
const { PrismaClient } = require('@prisma/client');
const {initializeApp, applicationDefault,} = require('firebase-admin/app');
const {getMessaging} = require('firebase-admin/messaging');

const prisma = new PrismaClient();

// Set up Firebase Admin SDK
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./parentsactivityapp-14800c43d85c.json";
initializeApp({
  projectId:"parentsactivityapp",
  credential: applicationDefault()
});

// Function to send notifications
async function sendNotification(token, taskName) {
  const message = {
    notification: {
      title: 'Upcoming Task Reminder',
      body: `Your task '${taskName}' is upcoming!`,
    },
    token: token,
  };
  try {
    await getMessaging().send(message);
    console.log('Notification sent successfully.');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Define the cron job
const job = new cron.CronJob('*/5 * * * * *', async () => {
  console.log('Running cron job...');

  try {
    // Fetch tasks from Prisma database
    const tasks = await prisma.task.findMany({
      where: {
        time: {
          // Filter tasks that are upcoming in the next 30 minutes
          gte: new Date(),
          lt: new Date(Date.now() + 30 * 60000) // 30 minutes ahead
        }
      },
       
    });

    // Send notifications for upcoming tasks
    tasks.forEach(async(task) => {
      if(!task.remainded){
        
        sendNotification(task.fcmToken, task.title);
        await prisma.task.update({
          data:{
            remainded:true
          },
          where:{
            id:task.id
          }
        })
      }
      });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
});

// Start the cron job
job.start();

app.use(cors());
app.use(express.json());
const taskRoutes = require('./routes/taskRoutes');
app.use('/tasks', taskRoutes)

app.listen(9000, console.log("LISTENING"))