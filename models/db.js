const mongoose = require('mongoose');
const { Schema } = mongoose;

const getObjectId = () => mongoose.Types.ObjectId();
const toObjectId = (id) => mongoose.Types.ObjectId(id);

module.exports = {
    mongoose,
    Schema,
    getObjectId,
    toObjectId
}