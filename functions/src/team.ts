const functions = require('firebase-functions');
import {gameInterface} from "./index.d";
import { fn, db } from "./index";

// Constants
const GAME_COLLECTION = "games";
const START_PUZZLE = "Ya4e3BMAAC8A2VrQ";

export const createTeam = fn
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

