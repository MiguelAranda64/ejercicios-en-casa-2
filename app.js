const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const User = require('./models/user'); //modelo user
const fs = require('fs'); // Módulo File System de Node.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//conexion a mongodb
const mongo_uri = 'mongodb://127.0.0.1:27017/SmartGym';

mongoose.connect(mongo_uri).then(() => {
    console.log(`Successfully connected to ${mongo_uri}`);
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

//registro de usuario
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const user = new User({ username, password, email }); // Asegúrate de incluir 'email'

    try {
        await user.save();
        res.status(200).send('USUARIO REGISTRADO');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('ERROR AL REGISTRAR AL USUARIO');
    }
});

//login de usuario
app.post('/auth', (req, res) => {
    const { username, password } = req.body;
    
    // Verificar si el usuario existe
    User.findOne({ username })
        .exec()
        .then(user => {
            if (!user) {
                res.status(500).send('EL USUARIO NO EXISTE');
            } else {
                // Verificar si la contraseña es correcta
                user.isCorrectPassword(password, (err, result) => {
                    if (err) {
                        res.status(500).send('ERROR AL AUTENTICAR');
                    } else if (result) {
                        // Verificar si es un usuario administrador
                        if (username === 'Mario') {
                            // Si el usuario es 'Mario', redirigir a la página CRUD
                            res.redirect('/admincrud');
                        } else {
                            // Si no, redirigir a la página de rutinas
                            res.redirect('/inicio');
                        }
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


//obtener ruta para inicio
app.get('/inicio', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inicio.html')); // Cambio aquí para enviar el archivo "inicio.html"
});

//obtener ruta para routines (pagina de rutinas de ejercicio)
app.get('/routines', (req, res) => {
    // Leer el archivo exercises.json y parsear los datos
    fs.readFile(path.join(__dirname, 'exercises.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading exercises.json:', err);
            return res.status(500).send('ERROR AL LEER LAS RUTINAS');
        }

        try {
            const exercisesData = JSON.parse(data);
            // Obtener el valor del parámetro bodyPart de la URL
            const bodyPart = req.query.bodyPart;

            // Encontrar la rutina correspondiente a la parte del cuerpo seleccionada
            const selectedRoutine = exercisesData.exercises.find(item => item.bodyPart.toLowerCase() === bodyPart.toLowerCase());

            // Renderizar la página routines.ejs con la rutina seleccionada
            if (selectedRoutine) {
                const routineHtml = selectedRoutine.routine.map(exercise => {
                    return `
                        <h2>${exercise.name}</h2>
                        <p>Difficulty: ${exercise.difficulty}</p>
                        <ul>
                            ${exercise.steps.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    `;
                }).join('');

                // Mostrar la rutina en la página
                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Rutinas</title>
                        <link rel="stylesheet" href="main.css">
                    </head>
                    <body>
                        <h1>Rutina seleccionada</h1>
                        <div id="routine-data">
                            ${routineHtml}
                        </div>
                    </body>
                    </html>
                `);
            } else {
                res.status(404).send('No se encontró una rutina para esta parte del cuerpo.');
            }
        } catch (parseError) {
            console.error('Error parsing exercises.json:', parseError);
            return res.status(500).send('ERROR AL ANALIZAR LAS RUTINAS');
        }
    });
});

app.listen(3000, () => {
    console.log('server started on port 3000');
});

module.exports = app;