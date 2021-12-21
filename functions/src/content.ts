import {fn, logger, ERROR} from "./index";
import {getFirestore} from "firebase-admin/firestore";
// Constants
const CONTENT_COLLECTION = "content";

// Modules
const db = getFirestore();

export const getContent = fn
    .https
    .onCall(async (contentId: string) => {
      // log incoming data
      logger.info(`contentId: ${contentId}`);

      // read from firestore
      const docRef = db.collection(CONTENT_COLLECTION).doc(contentId);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const document = docSnap.data();
        return document;
      }
      throw new ERROR("not-found", "Content not found.");
    });
