const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    /* eslint-disable no-underscore-dangle */
    const formattedObject = {
      ...returnedObject,
      id: returnedObject._id.toString(),
    };

    delete formattedObject._id;
    delete formattedObject.__v;
    /* eslint-enable no-underscore-dangle */

    return formattedObject;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
