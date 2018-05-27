// send to firebase
// const admin = require('firebase-admin');

// var serviceAccount = require('./key.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

module.exports = data => {
  return new Promise((resolve, reject) => {
    resolve(data);
  });
};
