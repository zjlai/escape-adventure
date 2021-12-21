import {fn, logger, ERROR} from "./index";
import {getFirestore} from "firebase-admin/firestore";
// Constants
const PUZZLE_COLLECTION = "puzzles";

// Modules
const db = getFirestore();

export const getPuzzle = fn
    .https
    .onCall(async (puzzleId: string) => {
      // log incoming data
      logger.info(`puzzleId: ${puzzleId}`);

      // read from firestore
      const docRef = db.collection(PUZZLE_COLLECTION).doc(puzzleId);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const document = docSnap.data();
        return document;
      }
      throw new ERROR("not-found", "Puzzle not found.");
    });
