const functions = require('firebase-functions');
import { fn, db } from "./index";

// Constants
const PUZZLE_COLLECTION = "puzzles";

export const getPuzzle = fn  
  .https
  .onCall(async (puzzleId: string) => {
    // log incoming data
    functions.logger.info(`puzzleId: ${puzzleId}`);

    // read from firestore
    const docRef = db.collection(PUZZLE_COLLECTION).doc(puzzleId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const document = docSnap.data();
      return document;
    }
    throw new functions.https.HttpsError("not-found", "Puzzle not found.");
  });