const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');
const mongoose = require('mongoose');

const { port, dbUrl, secret } = config;
const app = express();

// TO DO: Conección a la BD en mogodb
mongoose.connect('mongodb://localhost/crud-mongo')
.then((db)=>{
  console.log('connected');
}).catch((e)=>{
  console.log(e);
})
app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false })); //permite leer los datos string en json que envie el usuario
app.use(express.json());
app.use(authMiddleware(secret));

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }
  app.use(errorHandler);
  app.get('/',(req,res)=>{
    //aqui debo ejecutar el almacenamiento de la base de datos y emitir una respuesta
  })

});
app.listen(port, () => {
  console.info(`App listening on port ${port}`);
});
