import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";

// Init App and Firestore
export const app = initializeApp();
export const fn = functions.region("asia-northeast1");
export const logger = functions.logger;
export const ERROR= functions.https.HttpsError;
