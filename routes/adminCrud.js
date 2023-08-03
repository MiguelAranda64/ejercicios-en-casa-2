//codigo sin usar

const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Asegúrate de tener el modelo User configurado

// Ruta para obtener todos los usuarios
router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
});

// Ruta para crear un nuevo usuario
router.post('/api/users', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ username, password, email });
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        res.status(500).json({ error: 'Error al insertar usuario' });
    }
});

// Ruta para actualizar un usuario por su ID
router.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { newUsername, newEmail } = req.body;
        await User.findByIdAndUpdate(id, { username: newUsername, email: newEmail });
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Ruta para eliminar un usuario por su ID
router.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;
