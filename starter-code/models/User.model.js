//IMPORTACIONES
const mongoose= require('mongoose')
const {Schema, model}= mongoose
//la ultima linea
// const model= mongoose.model
// const Schema= mongoose.Schema

//SCHEMA
const UserSchema = new Schema(
    {
      username: {
        type: String,
        trim: true,
        required: [true, 'Username is required.'],
        unique: true
      },
      email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      },
      passwordHash: {
        type: String,
        required: [true, 'Password is required.']
    }
  },
    {
      timestamps: true
    }
  );
  

//GENERACIÓN DEL MODELO
const User= model('User', UserSchema)

//EXPORTACIÓN
module.exports= User;