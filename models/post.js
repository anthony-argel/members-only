let mongoose = require('mongoose');
const Schema = mongoose.Schema;
var { DateTime } = require('luxon');


let PostSchema = new Schema({
    title: {type:String, required:true},
    message: {type:String, required:true},
    timestamp: {type:Date, required:true},
    user: {type: Schema.Types.ObjectId, ref:'User', required:true}
});

PostSchema
.virtual('formatted_date')
.get(function() {
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});


module.exports = mongoose.model('Post', PostSchema);