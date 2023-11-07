const express = require('express');
const { dbFirebase } = require('./database/config');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config(); 

//Creamos server express
const app = express();

//Morgan para los logs 
app.use(morgan('combined'));

//Cors (que cualquiera pueda usar nuestra api)
app.use(cors())

//Directorio Publico
app.use( express.static('public') ) 
//Lectura y parseo del body
app.use( express.json() );

//Rutas
app.use('/api/data', require('./routes/data')); 

//Escuchar Peticiones
app.listen( process.env.PORT, () => {
    console.log("Corriendo en el puerto 4000");
})
