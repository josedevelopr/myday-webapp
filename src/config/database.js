const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/myday-db-app',{//se enviara un objeto de configuracion
    useCreateIndex : true,
    useNewUrlParser : true,
    useFindAndModify : false,
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));