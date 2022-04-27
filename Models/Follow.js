const FollowSchema = require('../Schemas/Follow');
const UserSchema = require('../Schemas/User');
const ObjectId = require('mongodb').ObjectId;

function followUser({ followingUserId, followerUserId }) {
    return new Promise(async (resolve, reject) => {

        try {

            const followObj = await FollowSchema.findOne({ followerUserId, followingUserId });

            if(followObj) {
                return reject("User already followed");
            }

            const follow = new FollowSchema({
                followingUserId,
                followerUserId,
                creationDatetime: new Date()
            })
            const followDb = await follow.save();

            return resolve(followDb);
        }
        catch(err) {
            return reject(err);
        }
    })
}   

function followingUsers({ followerUserId }) {
    return new Promise(async (resolve, reject) => {

        try {
            const followingDb = await FollowSchema.find({ followerUserId });

            let followingUserIds = [];

            followingDb.forEach((followObj) => {
                followingUserIds.push(ObjectId(followObj.followingUserId));
            })

            const followingUserDetails = await UserSchema.aggregate([
                {   $match: {
                        _id: { $in: followingUserIds }
                    } 
                },
                {
                    $project: {
                        username: 1,
                        name: 1,
                        profilePic: 1 
                    }
                }
            ])

            resolve(followingUserDetails);
        }
        catch(err) {
            reject(err);
        }
    })
}

function followerUsers({ followingUserId }) {
    return new Promise(async (resolve, reject) => {

        try {
            const followerDb = await FollowSchema.find({ followingUserId });

            let followerUserIds = [];

            followerDb.forEach((followObj) => {
                followerUserIds.push(ObjectId(followObj.followerUserId));
            })

            const followerUserDetails = await UserSchema.aggregate([
                {   $match: {
                        _id: { $in: followerUserIds }
                    } 
                },
                {
                    $project: {
                        username: 1,
                        name: 1,
                        profilePic: 1 
                    }
                }
            ])

            resolve(followerUserDetails);
        }
        catch(err) {
            reject(err);
        }
    })
}

function unfollowUser({ followingUserId, followerUserId }) {
    return new Promise(async (resolve, reject) => {
        try {
            const unfollowDb = await FollowSchema.findOneAndDelete({ followingUserId, followerUserId });

            return resolve(unfollowDb);
        }
        catch(err) {
            return reject(err);
        }
    })
}

// function addTime() {
//     return new Promise(async (resolve, reject) => {

//         const follows = await FollowSchema.find();

//         console.log(follows);

//         follows.forEach(async (follow) => {
//             await FollowSchema.findOneAndUpdate({_id: follow._id}, {creationDatetime: new Date()});
//         })
        
//         resolve();
//     })
// }

module.exports = { followUser, followingUsers, followerUsers, unfollowUser };