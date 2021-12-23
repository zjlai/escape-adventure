import {fn, logger, ERROR} from "./firebaseInit";
import {getFirestore} from "firebase-admin/firestore";
import { solutionInterface } from "./scoring.d";

// Constants
const SOLUTION_COLLECTION = "solutions";

// Modules
const db = getFirestore();

// Validators

export const validateAnswer = fn
    .https
    .onCall(async (solId: string) => {
      logger.debug(`solId: ${solId}`);
      const solRef = db.collection(SOLUTION_COLLECTION).doc(solId);
      const solSnap = await solRef.get();
      logger.debug(`solSnap: ${solSnap.exists}`);
      logger.debug(`solData: ${solSnap.data()}`);

      if (solSnap.exists) {
        logger.info(`Validating Answer: ${solId}`);
        const data = solSnap.data() as solutionInterface;

        logger.debug(`Solution Object: ${data}`);

        let result;
        switch (data.solutionType) {
          case "narrative":
            result = {next: data.next};
            break;
        }
        return result;
      }
      throw new ERROR("not-found", "Solution not found.");
    });
