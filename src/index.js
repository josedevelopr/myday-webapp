const express = require('express')
const path = require('path')
const exhbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const bodyParser = require('body-parser')
require('./config/database')
require('./config/passport')

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exhbs({
    defaultLayout : 'main',
    layoutsDir : path.join(app.get('views'), 'layouts'),
    partialsDir : path.join(app.get('views'), 'partials'),
    extname : '.hbs'
}));
app.set('view engine', '.hbs');

// MIDDLEWARE
app.set(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use(require('./routes/index'))
app.use(require('./routes/user'))
app.use(express.static(path.join(__dirname, 'public')))

app.listen(app.get('port'), () => {
    console.log('SERVER ON PORT', app.get('port'))
});