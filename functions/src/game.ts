import {gameInterface} from "./index.d";
import {fn, logger} from "./firebaseInit";
import {getFirestore} from "firebase-admin/firestore";

// Constants
const GAME_COLLECTION = "games";
const START_PUZZLE = "Ya4e3BMAAC8A2VrQ";

// Modules
const db = getFirestore();
export const createGame = fn
    .https
    .onCall(async (data: gameInterface) => {
      // log incoming data
      logger.info(data);

      // write to firestore
      await db.collection(GAME_COLLECTION).add(data);

      return {
        startPuzzle: START_PUZZLE,
      };
    });
