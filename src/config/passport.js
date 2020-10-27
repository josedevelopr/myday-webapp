const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

//preparando la autenticación local
passport.use(new LocalStrategy({
    usernameField : 'user'//indicando con que se hara la autenticación
}, async (username, password, done) =>{  
    console.log(username, password);
    const user = await User.findOne({user : username});
    
    if(!user){
        ///    done(error?,user?,message?)
        return done(null,false,{message : 'Not User found'});
    }else{
        const match = await user.matchPassword(password);
        if(match){
            ///    done(error?,user?,message?)
            return done(null,user);
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