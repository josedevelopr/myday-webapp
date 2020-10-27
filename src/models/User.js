const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    firstName : {type : String},
    lastName : {type : String},
    birthday : {type : Date},
    sex : { type : String},
    user : {type : String},
    email : {type : String, required : true },
    password : {type : String, required : true },
    profilePhoto : {type : String},
    registerCompleted : {type : Boolean, default: false},
    date : {type : Date, default : Date.now }
});

//funciones para cifrar contraseñas
UserSchema.methods.encryptPassord = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password,salt);
    return hash;
};

//funciones para poder comparar contraseñas cifrados
UserSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);