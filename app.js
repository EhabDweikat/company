const express = require('express')
const { dbConnection } = require('./src/database/DBConnection');
const app = express()
require('dotenv').config({path:"./config/.env"});
const port = process.env.PORT;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const basURL=process.env.BASEURL
var morgan = require('morgan')

app.use(express.json());
app.use('/projects',require('./src/components/projects/projects.api'));
app.use(`${basURL}/auth`,require('./src/components/auth/auth.api'))
if(process.env.NODE_ENV=="development"){
    app.use(morgan('dev'))

}
dbConnection();

app.listen(port, () => console.log(`Example app listening on port ${port}!`))