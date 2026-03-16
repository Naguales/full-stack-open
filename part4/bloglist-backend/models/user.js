const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    /* eslint-disable no-underscore-dangle */
    const formattedObject = {
      ...returnedObject,
      id: returnedObject._id.toString(),
    };

    delete formattedObject._id;
    delete formattedObject.__v;
    delete formattedObject.passwordHash;
    /* eslint-enable no-underscore-dangle */

    return formattedObject;
  },
});

module.exports = mongoose.model('User', userSchema);
