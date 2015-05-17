// Grab packages for user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// User schema
var UserSchema = new Schema({
  name: String,
  username: { type: String, required: true, index: { unique: true }}, // Username cannot be duplicated
  password: { type: String, required: true, select: false } // When querying users, do not return the password
});

// Hash the password prior to saving
UserSchema.pre('save', function(next) {
  var user = this;

  // Hash the password only if it's been change or it's a new user
  if (!user.isModified('password')) return next();

  // Generate the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);

    // Change password to the hashed version
    user.password = hash;

    next();
  });
});

// Method to compare password with user's hashed password
UserSchema.methods.comparePassword = function(password) {
  var user = this;

  return bcrypt.compareSync(password, user.password);
};

// Return the model
module.exports = mongoose.model('User', UserSchema);
