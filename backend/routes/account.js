const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const router = express.Router();

router.get('/balance', authMiddleware, async(req,res)=> {
    const account = await Account.findOne({
        userId:req.userId
    });
    res.status(200).json({
        balance: account.balance
    });
});

router.post('/transfer', authMiddleware, async(req,res) => {
    const {amount,to} = req.body;
    
    const account = await Account.findOne({
        userId: req.userId
    });

    if(account.balance < amount)
    {
        return res.json({
            message: "Insufficient Balance in the account."
        });
    }
    
    const toAccount = await Account.findOne({
        userId: to
    });

    if(!toAccount)
    {
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Transaction
    
    await Account.updateOne({
        userId:req.userId
    },{
        $inc:{
            balance: -amount
        }
    });

    await Account.updateOne({
        userId:to
    },{
        $inc:{
            balance: amount
        }
    });

    res.status(200).json({
        message:"Transaction is Successful!"
    });
});

module.exports = router;