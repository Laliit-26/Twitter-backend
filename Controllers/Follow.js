const express = require('express');
const FollowRouter = express.Router();

const { followUser, followingUsers, followerUsers, unfollowUser } = require('../Models/Follow');
const { validateMongoUserIds } = require('../Utils/FollowUtils');

FollowRouter.post('/follow-user', async (req, res) => {

    const followingUserId = req.body.followingUserId;
    const followerUserId = req.body.followerUserId; // req.session.user.userId
console.log(followingUserId, followerUserId);
    if(!validateMongoUserIds([followingUserId, followerUserId])) {
        return res.send({
            status: 401,
            message: "Invalid data",
            error: "Invalid mongo object id"
        })
    }

    try {
        const followDb = await followUser({followingUserId, followerUserId});

        return res.send({
            status: 200,
            message: "Follow Successful",
            data: followDb
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Follow Unsuccessful",
            error: err
        })
    }
})

// TODO: Paginate the API
FollowRouter.post('/following', async (req, res) => {

    const followerUserId = req.body.followerUserId; // req.session.user.userId

    if(!validateMongoUserIds([followerUserId])) {
        return res.send({
            status: 401,
            message: "Invalid data",
            error: "Invalid mongo object id"
        })
    }

    try {
        const followingDb = await followingUsers({ followerUserId });

        res.send({
            status: 200,
            message: "Successfull",
            data: followingDb
        })
    }
    catch(err) {
        res.send({
            status: 400,
            message: "Could not get following",
            error: err
        })
    }
})

// TODO: Paginate the API
FollowRouter.post('/followers', async (req, res) => {

    const followingUserId = req.body.followingUserId; // req.session.user.userId;

    if(!validateMongoUserIds([followingUserId])) {
        return res.send({
            status: 401,
            message: "Invalid data",
            error: "Invalid mongo object id"
        })
    }

    try {

        const followersDb = await followerUsers({ followingUserId });
        
        return res.send({
            status: 200,
            message: "Successful",
            data: followersDb
        })

    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Could not get followers",
            error: err
        })
    }

})

FollowRouter.post('/unfollow-user', async (req, res) => {

    const followerUserId = req.body.followerUserId; // req.session.user.userId
    const followingUserId = req.body.followingUserId;

    if(!validateMongoUserIds([followingUserId, followerUserId])) {
        return res.send({
            status: 401,
            message: "Invalid data",
            error: "Invalid mongo object id"
        })
    }

    try {

        const unfollowDb = await unfollowUser({ followerUserId, followingUserId });

        return res.send({
            status: 200,
            message: "Unfollow Successful",
            data: unfollowDb
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Unfollow unSuccessful",
            error: err
        })
    }

})

module.exports = FollowRouter;