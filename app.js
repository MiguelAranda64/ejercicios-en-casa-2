const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express();
const User = require('./models/user') //modelo user

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

const mongo_uri = 'mongodb://127.0.0.1:27017/SmartGym';

mongoose.connect(mongo_uri).then(() => {
    console.log(`Successfully connected to ${mongo_uri}`);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


  app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
  
    try {
      await user.save();
      res.status(200).send('USUARIO REGISTRADO');
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).send('ERROR AL REGISTRAR AL USUARIO');
    }
  });
  

app.post('/auth', (req, res) =>{
  const {username, password} = req.body;

  User.findOne({username}) // Use the Query object, no need for callback here
    .exec() // Execute the query
    .then(user => {
      if (!user) {
        res.status(500).send('EL USUARIO NO EXISTE');
      } else {
        user.isCorrectPassword(password, (err, result) => {
          if (err) {
            res.status(500).send('ERROR AL AUTENTICAR');
          } else if (result) {
            res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE');
          } else {
            res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTA');
          }
        });
      }
    })
    .catch(err => {
      res.status(500).send('ERROR AL AUTENTICAR AL USUARIO');
    });
});


app.listen(3000, () => {
    console.log('server stated on port 3000')
})

module.exports = app;