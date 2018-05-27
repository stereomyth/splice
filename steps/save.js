// send to firebase
const firebase = require('firebase-admin');

!firebase.apps.length
  ? firebase
      .initializeApp({
        credential: firebase.credential.cert(require('./key.json')),
      })
      .firestore()
  : firebase.app().firestore();

const db = firebase.firestore();

module.exports = data => {
  return new Promise((resolve, reject) => {
    let batch = db.batch();

    Object.keys(data).forEach(cinema => {
      batch.set(db.collection('weekly').doc(cinema), data[cinema]);
      delete data[cinema].films;
      batch.set(db.collection('locations').doc(cinema), data[cinema]);
    });

    batch.commit();

    resolve(Object.keys(data));
  });
};
