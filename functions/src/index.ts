import * as functions from "firebase-functions";
import {initializeApp, firestore} from "firebase-admin";

// Init App and Firestore
const app = initializeApp();
export const db = firestore(app);
export const fn = functions.region("asia-northeast1");

// Export linkages
export * from "./solutions";
export * from "./team";
export * from "./scoring";
