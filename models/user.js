let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type:String, required:true},
    password: {type:String, required:true},
    joindate: {type:Date, rquired:true},
    memberstatus: {type:String, required:true}
});

module.exports = mongoose.model('User', UserSchema);