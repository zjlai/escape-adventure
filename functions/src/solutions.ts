const functions = require('firebase-functions');
import { fn, db } from "./index";

// Constants
const GAME_SOLUTIONS = "solutions";


export const getSolutions = fn
    .https
    .onCall(async (data: string) => {

      // log incoming data
      functions.logger.info(data);

      // get data from firestore
      const doc = await db.collection(GAME_SOLUTIONS).doc(data).get();
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc);
      }
      
      return {
        solutions: doc.data(),
      };

    });
  