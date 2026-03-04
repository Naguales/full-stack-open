const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);
mongoose
  .connect(url, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
    dbName: 'phonebook',
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  number: {
    type: String,
    minlength: [8, 'Phone number must be at least 8 characters long'],
    validate: {
      validator(value) {
        return /^\d{2,3}-\d+$/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number (format: XX-XXXXXXX or XXX-XXXXXXX)`,
    },
  },
});

personSchema.set('toJSON', {
  // Mongoose transform mutates returnedObject by design.
  /* eslint-disable no-param-reassign, no-underscore-dangle */
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
  /* eslint-enable no-param-reassign, no-underscore-dangle */
});

module.exports = mongoose.model('Person', personSchema);
