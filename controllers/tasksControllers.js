const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const getAllTasks = async(req, res)=>{
    try {
        const tasks = await prisma.task.findMany();
        return res.status(200).json({
            message: "SUCCESS",
            data: tasks
        })

    } catch (error) {
        console.log("ERROR WHILE GETTTING ALL TASKS", error);
        return res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
};


const createNewTask = async(req,res)=>{
    try {
        const {title, description, time, priority, category, fcmToken} = req.body;
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                time,
                priority,
                fcmToken,
                category
            }
        });
        return res.status(201).json({
            message: "SUCCESS",
            data: newTask
        })
    } catch (error) {
        console.log("ERROR WHILE CREATING NEW TASKS", error);
        return res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
};


const updateTask = async(req,res)=>{
    try {
        const {id} = req.params;
        const {title, description, time, priority, category} = req.body;
        const newTask = await prisma.task.update({
            data: {
                title,
                description,
                time,
                priority,
                category
            },
            where:{
                id: +id
            }
        });
        return res.status(201).json({
            message: "SUCCESS",
            data: newTask
        })
    } catch (error) {
        console.log("ERROR WHILE UPDATING  TASKS", error);
        return res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
};

const deleteTask = async(req,res)=>{
    try {
        const {id} = req.params;
        const newTask = await prisma.task.deleteMany({
            where:{
                id: +id
            }
        });
        return res.status(200).json({
            message: "SUCCESS",
        })
    } catch (error) {
        console.log("ERROR WHILE DELETING TASKS", error);
        return res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
};

module.exports = {
    getAllTasks,
    createNewTask,
    updateTask,
    deleteTask
}