import Cloudant from '@cloudant/cloudant';
import {cloudantPassword , cloudantUrl , cloudantUsername} from '../cred.js'




const cloudant = new Cloudant({
    url: cloudantUrl,
    username: cloudantUsername,
    password: cloudantPassword,
  });
  cloudant.ping((err) => {
    if (err) {
      console.error('Failed to connect to Cloudant:', err);
    } else {
      console.log('Connected to Cloudant');
    }
  });

  const dbName = 'graphql';
 export  const db = cloudant.db.use(dbName);


  export default cloudant;