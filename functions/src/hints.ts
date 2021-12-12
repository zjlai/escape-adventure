import {fn, logger} from "./firebaseInit";
import {getFirestore} from "firebase-admin/firestore";
import {hintInterface, hintsResponseInterface} from "./index.d";
// Constants
const HINTS_COLLECTION = "hints";

// Modules
const db = getFirestore();

export const getHints = fn
    .https
    .onCall(async (data: hintInterface) => {
      // log incoming data
      logger.info(data);

      // get hint
      const query = db.collection(HINTS_COLLECTION)
          .where("puzzleRef", "==", data.puzzleRef);
      const hints = await query.get();
      const hintsArray: hintsResponseInterface[]= [];
      hints.forEach((hint) => {
        hintsArray.push({
          hintId: hint.id,
          totalHints: hint.get("totalHints"),
        });
      });
      return {
        hints: hintsArray,
      };
    });


export const getHint = fn
    .https
    .onCall(async (data: hintInterface) => {
      // log incoming data
      logger.info(data);

      // get hint
      const query = db.collection(HINTS_COLLECTION).doc(data.hintRef as string);
      const hint = await query.get();
      return {
        hint: hint.get("hints")[data.hintLevel as number],
      };
    });
