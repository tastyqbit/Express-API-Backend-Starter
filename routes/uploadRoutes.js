const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });


const s3 = new AWS.S3({
  accessKeyId: keys.s3_keyId,
  secretAccessKey: keys.s3_secretKey
});


module.exports = app => {
  app.get('/api/uploadImage', (req, res) => {

    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl('putObject', {
      Bucket: '',
      ContentType: 'jpeg',
      Key: key
      },
      (err, url) => res.send({ key, url })
    );
  });
}
