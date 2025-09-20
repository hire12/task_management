import { Router } from "express";
import User from "../models/User";


const router = Router();

router.get('/user', async(req, res) => {
    const user = await User.find()
    res.status(200).json({msg: "Here is All Users", User: user})
})

router.post('/user', async(req, res) => {
    try {
        const user = new User(req.body);
        user.save()
        res.status(201).json({msg: "User Created", User: user})
    } catch(err) {
        res.status(500).json({msg: "Server error", error: err})
    }
})


export default router;
