const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const passport = require('passport');
const fs = require("fs");
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const credentials = {
  key: fs.readFileSync(keys.ssl_key),
  cert: fs.readFileSync(keys.ssl_cert),
  passphrase: keys.ssl_passphrase
};


const app = express();

app.use(helmet());

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send({It: 'works'});
});

require('./routes/authRoutes')(app);
require('./routes/uploadRoutes')(app);

app.listen(5000);
