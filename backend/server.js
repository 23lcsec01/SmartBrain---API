require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); // latest version of expressJS now comes with Body-Parser!
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({ 
  client: 'pg',
  connection: process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: (process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1'))
          ? false
          : { rejectUnauthorized: false }
      }
    : {
        host : '127.0.0.1',
        user : 'aneagoie',
        password : '',
        database : 'smart-brain'
      }
});

// Auto-create database tables if they do not exist
const initializeDatabase = async () => {
  try {
    const hasUsersTable = await db.schema.hasTable('users');
    if (!hasUsersTable) {
      console.log('Creating "users" table...');
      await db.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name', 100);
        table.text('email').unique().notNullable();
        table.bigInteger('entries').defaultTo(0);
        table.timestamp('joined').notNullable();
      });
      console.log('"users" table created successfully.');
    }

    const hasLoginTable = await db.schema.hasTable('login');
    if (!hasLoginTable) {
      console.log('Creating "login" table...');
      await db.schema.createTable('login', (table) => {
        table.increments('id').primary();
        table.string('hash', 100).notNullable();
        table.text('email').unique().notNullable();
      });
      console.log('"login" table created successfully.');
    }
  } catch (err) {
    console.error('Error auto-creating database tables:', err.message);
  }
};
initializeDatabase();

const app = express();

app.use(cors())
app.use(express.json()); // latest version of expressJS now comes with Body-Parser!

app.get('/', (req, res)=> {
  db.select('*').from('users')
    .then(users => res.json(users))
    .catch(err => res.status(400).json('error retrieving users'))
})
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
  console.log(`app is running on port ${PORT}`);
})