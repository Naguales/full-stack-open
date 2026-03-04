require('dotenv').config();
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const url = process.env.MONGODB_URI.replace('<db_password>', encodeURIComponent(password));

mongoose.set('strictQuery', false);
const connectOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  dbName: 'phonebook',
  serverSelectionTimeoutMS: 5000,
};

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const run = async () => {
  try {
    await mongoose.connect(url, connectOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');

    if (process.argv.length === 3) {
      const persons = await Person.find({});
      console.log('phonebook:');
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      return;
    }

    if (process.argv.length === 5) {
      const name = process.argv[3];
      const number = process.argv[4];
      const person = new Person({ name, number });
      await person.save();
      console.log(`added ${name} number ${number} to phonebook`);
      return;
    }

    console.log('usage:');
    console.log('node mongo.js <password>');
    console.log('node mongo.js <password> <name> <number>');
  } catch (error) {
    console.error('error connecting to MongoDB:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

run();
