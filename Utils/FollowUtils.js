const ObjectId = require('mongodb').ObjectId;

function validateMongoUserIds(userIds) {

    for(let userId of userIds) {
        if(!userId) {
            return false;
        }
    
        if(!ObjectId.isValid(userId)) {
            return false;
        }
    }

    return true;
}

module.exports = { validateMongoUserIds };