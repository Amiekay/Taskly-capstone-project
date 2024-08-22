
import cron from 'node-cron'
require('dotenv').config()
import { sendNotification  } from '../utils/notification';
const userModel = require('../models/userModel')
const taskModel = require('../models/taskModel')
import moment from 'moment';


  // Runs every hour to check for tasks with approaching due dates
  cron.schedule('0 * * * *', async () => {
    console.log('Running task notification cron job...');
    
    const now = moment();
    const oneHourFromNow = moment().add(1, 'hour');
    const twelveHoursFromNow = moment().add(12, 'hours');
    const oneDayFromNow = moment().add(1, 'day');

    try {
      // Find tasks with due dates 1 hour, 12 hours, or 1 day from now
      const tasks = await taskModel.find({
        dueDate: { 
          $gte: now.toDate(),
          $lte: oneDayFromNow.toDate()
        }
      });

        for (let task of tasks){
        const dueDate = moment(task.dueDate);
        let notificationMessage = '';

        if (dueDate.isSame(oneHourFromNow, 'minute')) {
          notificationMessage = `Reminder: Your task "${task.title}" is due in 1 hour.`;
        } else if (dueDate.isSame(twelveHoursFromNow, 'minute')) {
          notificationMessage = `Reminder: Your task "${task.title}" is due in 12 hours.`;
        } else if (dueDate.isSame(oneDayFromNow, 'minute')) {
          notificationMessage = `Reminder: Your task "${task.title}" is due in 1 day.`;
        }

        if (notificationMessage) {
            for( let userId of task.assignedTo){
                const user = await userModel.findById(userId)
                sendNotification(user.email, 'Task duedate reminder', notificationMessage)
            }
        }
    }

    } catch (error) {
      console.error('Error running task notification cron job:', error);
    }
  });


