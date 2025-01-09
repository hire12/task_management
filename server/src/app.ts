import express, { Application } from "express";
import connectDB from "./config/db";
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './router/userRouter'
import authRouter from './router/authRouter'
import taskRouter from './router/taksRouter'
dotenv.config()

const app: Application = express();
const PORT = process.env.PORT || 3000

app.use(cors())

app.use(express.json());

connectDB()


app.get('/', (req, res) => {
    res.send("Welcome")
})

app.use('/api', userRouter)
app.use('/auth', authRouter)
app.use('/api', taskRouter)

app.listen(PORT, ()=> console.log(`app running on http://localhost:${PORT}`))
