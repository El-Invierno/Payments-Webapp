const express = require('express');
const router = express.Router();
const zod = require('zod');
const { User, Account } = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const { authMiddleware } = require('../middleware');

const signupSchema = zod.object({
    username:zod.string(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})

router.post('/signup', async (req,res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(body); // safeParse returns an object {success, err/data}.
    if(!success)
    {
        return res.status(411).json({
            message : "Email already taken / Incorrect Inputs, validation failed!"
        });
    }
    const user = await User.findOne({
        username:body.username
    });
    if(user)
    {
        return res.status(411).json({
            message : "Email already taken / Incorrect Inputs, validation failed!"
        });
    }
    else
    {
        const dbUser = await User.create(body);
        const userId = dbUser._id;

        // Assigning random bank balances to userId.
        await Account.create({
            userId:userId,
            balance: 1 + Math.random() * 10000 
        });
        
        const token = jwt.sign({
            userId:dbUser._id
        },JWT_SECRET);
        res.status(200).json({
            message:"User created successfully",
            token:token
        });
    }
});

const signinBody = zod.object({
    username: zod.string(),
	password: zod.string()
});

router.post('/signin', async(req,res)=>{
    const body = req.body; // {username,password}
    const {success} = signinBody.safeParse(body);
    if(!success)
    {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }
    const user = await User.findOne({
        username: body.username,
        password: body.password
    });
    if(!user)
    {
        return res.status(411).json({
            message:"Error while logging in"
        });
    }   
    else
    {
        const token = jwt.sign({
            userId:user._id
        },JWT_SECRET);

        res.status(200).json({
            token:token
        });
    }
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

router.put('/', authMiddleware, async(req,res) => {
    const body = req.body;
    const {success} = updateBody.safeParse(body);
    if(!success)
    {
        res.status(411).json({
            message:"Error while updating information."
        });
    }
    await User.updateOne({_id:req.userId},req.body);
    res.json({
        message:"Updated Successfully!"
    });
});


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
