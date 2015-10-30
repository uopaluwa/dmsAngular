var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var documentSchema = new Schema({
  ownerId: {type: String, required: true, ref: 'User'},
  title : {type: String, required: true, unique: true},
  content: String,
  dateCreated: { type: Date, default: Date.now },
  lastModified: {type: Date, default: Date.now }
});

documentSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.lastModified = currentDate;
  next();
});

var Document = mongoose.model('Document', documentSchema);
module.exports = Document;