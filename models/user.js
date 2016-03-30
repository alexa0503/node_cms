var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	email: String,
	role: String,
	created: Date,
});

var User = mongoose.model('cms_user', userSchema);
module.exports = User;
