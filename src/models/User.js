const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    firstName : {type : String, required : true},
    lastName : {type : String, required : true},
    birthday : {type : Date, required : true},
    sex : { type : String, required : true},
    name : {type : String, required : true},
    email : {type : String, required : true },
    password : {type : String, required : true },
    profilePhoto : {type : String, required : true},
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