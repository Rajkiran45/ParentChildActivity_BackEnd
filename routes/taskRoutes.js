const express = require('express');
const { getAllTasks, updateTask, deleteTask, createNewTask } = require('../controllers/tasksControllers');
const router = express.Router();

router.get('/', getAllTasks).post('/', createNewTask);
router.patch('/:id', updateTask).delete('/:id', deleteTask);


module.exports = router;