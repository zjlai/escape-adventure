import {fn, logger, ERROR} from "./index";
import {getFirestore} from "firebase-admin/firestore";

// Constants
const GAME_SOLUTIONS = "solutions";
const db = getFirestore();

export const getSolutions = fn
    .https
    .onCall(async (data: string) => {
      // log incoming data
      logger.info(data);

      // get data from firestore
      const docRef = db.collection(GAME_SOLUTIONS).doc(data);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        throw new ERROR("not-found", "Solution not found.");
      } else {
        console.log("Document data:", docSnap.data());
      }
      return {
        solutions: docSnap.data(),
      };
    });
