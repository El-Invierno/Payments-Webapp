// Create a file that exports the express router.
// This is the main router, further if any other user routes are present, they get routed off to the userRouter.


const express = require('express');
const router = express.Router();

const UserRouter = require('./user');
const AccountRouter = require('./account');

router.use('/user',UserRouter);
router.use('/account',AccountRouter);


module.exports = router;

