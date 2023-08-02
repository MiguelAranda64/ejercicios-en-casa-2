const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Asegúrate de tener el modelo User configurado

const adminCrudRouter = require('./routes/adminCrud'); // Ruta a tu archivo adminCrud.js
app.use('/', adminCrudRouter); // Usar la ruta en la aplicación


router.get('/admincrud', async (req, res) => {
    try {
        const users = await User.find(); // Obtener todos los usuarios de MongoDB
        res.render('adminCrud', { users });
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).send('Error obteniendo usuarios');
    }
});

// Insertar nuevo usuario
router.post('/admincrud', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, password, email });
        await newUser.save();
        res.redirect('/admincrud'); // Redirige de nuevo a la página después de la inserción
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        res.status(500).send('Error al insertar usuario');
    }
});

// Actualizar usuario
router.put('/admincrud/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, password, email } = req.body;
        await User.findByIdAndUpdate(userId, { username, password, email });
        res.redirect('/admincrud'); // Redirige de nuevo a la página después de la actualización
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).send('Error al actualizar usuario');
    }
});

// Eliminar usuario
router.delete('/admincrud/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        res.redirect('/admincrud'); // Redirige de nuevo a la página después de la eliminación
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).send('Error al eliminar usuario');
    }
});


module.exports = router;
