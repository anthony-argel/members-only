let mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PostSchema = new Schema({
    title: {type:String, required:true},
    message: {type:String, required:true},
    timestamp: {type:Date, required:true},
    user: {type: Schema.Types.ObjectId, ref:'user', required:true}
});

module.exports = mongoose.model('Post', PostSchema);