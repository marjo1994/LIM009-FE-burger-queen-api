const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Users = require('./modelData')

const { port, dbUrl, secret } = config;

const app = express();

// TO DO: Conección a la BD en mogodb
//Aqui conectamos con la base de datos de mongodb
mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('connected'); //si consoleas esta pagina te sale este connected y puedes verificar en la consola de mongod.exe
  }).catch((e) => {
    console.log(e);
  })

app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false })); //permite leer los datos string en json que envie el usuario
app.use(express.json());
app.use(authMiddleware(secret));

//middleware
//app.use(morgan('dev'))

app.get('/users', (req, res) => {
  //  let userId = req.params._id
  Users.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(500).send('error al traer usuario: ' + err)
    }
    if (!user) {
      return res.status(404).send('error al encontrar usuario')
    }
    console.log(user._id)
    res.status(200).send(user)
  });
});
// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }
  app.use(errorHandler);
/*app.post('/register',signUp)
  app.get('/signIn',signIn)
  app.post('/orders',orders)
  app.post('/register',register) */
});

app.listen(port, () => {
  console.info(`App listening on port ${port}`);
});




