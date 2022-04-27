const cron = require('node-cron');
const BlogsSchema = require('./Schemas/Blogs');
const ObjectId = require('mongodb').ObjectId;

function cleanUpBin() {
    cron.schedule('0 2 * * *', async () => {
        
        const dbBlogs = await BlogsSchema.aggregate([
            {$match: {deleted: true}},
            {$project: {_id: 1, deletionDatetime: 1}} 
        ])

        dbBlogs.forEach(async (blog) => {
            const deletionDatetime = (new Date(blog.deletionDatetime)).getTime();
            const currentDatetime = Date.now();
            const diff = (currentDatetime - deletionDatetime) / (1000*60*60*24);

            if(diff >= 30) {
                await BlogsSchema.findOneAndDelete({_id: ObjectId(blog._id)});
            }
        })

        console.log('Clean up Bin cron Successful');
    },{
        scheduled: true,
        timezone: "Asia/Colombo"
    })
}

module.exports = { cleanUpBin };