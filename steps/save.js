// send to firebase
const firebase = require('firebase-admin');

var serviceAccount = {
  type: 'service_account',
  project_id: 'splice-cw',
  private_key_id: '434ae702dfe0fc5c62d2fcf7efcf536bc76ef4a1',
  private_key: Buffer.from(process.env.fire_key, 'base64').toString(),
  client_email: 'node-test@splice-cw.iam.gserviceaccount.com',
  client_id: '101311329399473254931',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://accounts.google.com/o/oauth2/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/node-test%40splice-cw.iam.gserviceaccount.com',
};

!firebase.apps.length
  ? firebase
      .initializeApp({
        credential: firebase.credential.cert(serviceAccount),
      })
      .firestore()
  : firebase.app().firestore();

const db = firebase.firestore();

module.exports = data => {
  let batch = db.batch();

  Object.keys(data).forEach(cinema => {
    batch.set(db.collection('weekly').doc(cinema), data[cinema]);
    delete data[cinema].films;
    batch.set(db.collection('locations').doc(cinema), data[cinema]);
  });

  return batch.commit();
};
