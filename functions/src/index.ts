import * as functions from "firebase-functions";
import {initializeApp, firestore} from "firebase-admin";
// import {gameInterface} from "./index.d";

// Constants
const GAME_COLLECTION = "games";
const START_PUZZLE = "Ya4e3BMAAC8A2VrQ";
const PUZZLE_COLLECTION = "puzzles";

console.log(GAME_COLLECTION + START_PUZZLE + PUZZLE_COLLECTION);

// Init App and Firestore
const app = initializeApp();
export const db = firestore(app);
export const fn = functions.region("asia-northeast1");

// Export linkages
export * from "./solutions";
export * from "./team";
export * from "./scoring";
export * from "./puzzle";

