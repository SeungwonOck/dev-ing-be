const mongoose = require('mongoose')

function convertToObjectId(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = convertToObjectId;