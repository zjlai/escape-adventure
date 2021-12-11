import * as functions from "firebase-functions";
import {initializeApp, firestore} from "firebase-admin";
<<<<<<< HEAD
=======
import {gameInterface} from "./index.d";

// Constants
const GAME_COLLECTION = "games";
const START_PUZZLE = "Ya4e3BMAAC8A2VrQ";
const PUZZLE_COLLECTION = "puzzles";
>>>>>>> acae125bc765977f050e84fb7a6aadd2133caed1

// Init App and Firestore
const app = initializeApp();
export const db = firestore(app);
export const fn = functions.region("asia-northeast1");

// Export linkages
export * from "./solutions";
export * from "./team";
export * from "./scoring";
export * from "./puzzle";

