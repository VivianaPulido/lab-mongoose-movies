const express = require('express');
const mongoose= require('mongoose');
const router  = express.Router();
const User= require('../models/User.model')
const bcrypt = require('bcrypt')
const saltRounds = 10

//Mostrar formulario de registro
router.get('/signup', (req, res, next) => {
    res.render('users/signup')
})

//Post del signup (trae la info del formulario)
router.post('/signup', async (req, res, next) => {
    const {username, email, password}= req.body //eso se llama igual que los input del form

    if (!username || !email || !password) {
        res.render('users/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
      }

      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('users/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

try{
    const genResult= await bcrypt.genSalt(saltRounds)
    const passwordHash= await bcrypt.hash(password, genResult)// recibe dos param, el primero lo que vamos a hashear y lo sgundo los saltos

    const newUser= await User.create({
        username: username, 
        email: email,
        passwordHash: password
    })
    console.log(`The user ${newUser} was created`)
    res.redirect('/userProfile');
}
catch(error) {
    if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('users/signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
        res.status(500).render('users/signup', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
    }
}
})

//GET del login (nos lleva al formulario para identificarse)
router.get('/login', (req, res, next)=> {
    res.render('users/login')
})

//POST del login (procesa los datos del formulario de login)
router.post('/login', async(req, res, next) => {
    const { email, password } = req.body;
    console.log('SESSION =====> ', req.session);
   
    if (email === '' || password === '') {
      res.render('users/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
   
    try{
   const user=  await User.findOne({ email })
          if (!user) {
          res.render('users/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user;
            res.redirect('/userProfile');
        } else {
          res.render('users/login', { errorMessage: 'Incorrect password.' });
        }
    }
      catch(error) {next(error)};
      
  });


//Get de Perfil del usuario (lleva al user a su perfil)
router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });

//Post para hacer logout (responde al formulario-boton del layout)  
  router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });







module.exports= router;