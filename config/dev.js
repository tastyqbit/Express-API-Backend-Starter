module.exports = {
  mongoURI: 'mongodb://admin:password@localhost:27017/dev?authSource=admin',
  ssl_key: __dirname + '/local_certificate/key.pem',
  ssl_cert: __dirname + '/local_certificate/cert.pem',
  ssl_passphrase: '',
}
