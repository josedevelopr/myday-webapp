const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

//preparando la autenticación local
passport.use(new LocalStrategy({
    usernameField : 'user',//indicando con que se hara la autenticación
    passwordField : 'password'
}, async (user, password, done) =>{  
    // console.log(user, password);
    const userToLogin = await User.findOne({user : user});
    
    if(!userToLogin){
        ///    done(error?,user?,message?)
        return done(null,false,{message : 'Not User found'});
    }else{
        const match = await userToLogin.matchPassword(password);
        if(match){
            ///    done(error?,user?,message?)
            return done(null,userToLogin);
        }else{
            ///    done(error?,user?,message?)
            return done(null,false , {message : 'Incorrect Password'});
        }
    }

} ));

//Serializando los datos del usuarios que inició sesión para guardar el id
passport.serializeUser((user, done)=> {
    done(null, user.id);
});

//Deserializar y obteniendo todos los datos del usuario
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) =>{
        done(err,user);
    }).lean();
});