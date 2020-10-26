const express = require('express')
const exhbs = require('express-handlebars')

const app = express();

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
    console.log('SERVER ON PORT', app.get('port'))
});