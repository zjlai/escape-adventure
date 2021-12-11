import * as functions from "firebase-functions";
import {initializeApp, firestore} from "firebase-admin";
import {gameInterface} from "./index.d";

// Constants
const GAME_COLLECTION = "games";
const START_PUZZLE = "Ya4e3BMAAC8A2VrQ";
const PUZZLE_COLLECTION = "puzzles";

// Init App and Firestore
const app = initializeApp();
const db = firestore(app);

export const createTeam = functions
    .region("asia-northeast1")
    .https
    .onCall(async (data: gameInterface) => {
      // log incoming data
      functions.logger.info(data);

      // write to firestore
      await db.collection(GAME_COLLECTION).add(data);
      return {
        startPuzzle: START_PUZZLE,
      };
    });


export const getPuzzle = functions
    .region("asia-northeast1")
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
