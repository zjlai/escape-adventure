import {fn, logger} from "./index";
import {getFirestore} from "firebase-admin/firestore";
import {hintInterface} from "./index.d";
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

      return {
        puzzleRef: hints.docs[0].get("puzzleRef"),
        totalHints: hints.docs[0].get("totalHints"),
        hintRef: hints.docs[0].id,
        penalties: hints.docs[0].get("penalties"),
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
      return hint.get("hints")[data.hintLevel as number];
    });
