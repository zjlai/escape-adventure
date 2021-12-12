import {firestore} from "firebase-admin";
import {fn, logger, ERROR} from "./firebaseInit";
import {scoringInterface} from "./scoring.d";
import {getFirestore} from "firebase-admin/firestore";

// Modules
const db = getFirestore();
/* eslint-disable max-len */
/* Test scripts for firebase functions:shell

CORRECT ANSWER (PERFECT SCORE)
scoringText({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzleRef', hintsPenalty: 0, answer: '10', hintsUsed: 0, timeTaken: 40})

WRONG ANSWER
scoringText({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzleRef', hintsPenalty: 0, answer: '5', hintsUsed: 0, timeTaken: 40})

CORRECT ANSWER (PENALIZE TIME)
scoringText({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzleRef', hintsPenalty: 0, answer: '10', hintsUsed: 0, timeTaken: 120})

CORRECT ANSWER (PENALIZE HINTS)
scoringText({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzleRef', hintsPenalty: 2, answer: '10', hintsUsed: 1, timeTaken: 40})
*/

// Constants
const GAME_SOLUTIONS = "solutions";
const GAME_COLLECTION = "games";

export const scoreAnswer = fn
    .https
    .onCall(async (data: scoringInterface) => {
      // log incoming data
      logger.info(data);

      // get game session data from firestore
      const gameRef = db.collection(GAME_COLLECTION).doc(data.gameId);
      const game = await gameRef.get();

      if (!game.exists) {
        console.log("Game Id not found");
        throw new ERROR("not-found", "Game not found.");
      }

      console.log("Current total score: " + game.get("totalScore"));

      const query = db.collection(GAME_SOLUTIONS).where("puzzleRef", "==", data.puzzleRef);
      const solutionSnapshot = await query.get();
      const solution = solutionSnapshot.docs[0].data();

      // initialize Scoring
      let score = 0;

      // check for correct answer (to move this into a separate module later, e.g., if boolean answer = true then proceed)
      console.log("Checking for the correct answer => " + data.answer + " is equals to " + solution.answer);
      if (data.answer == solution.answer) {
        // fractionalize score by time taken, where
        // if timeTaken <= minTime = 100%
        // if timeTaken > maxTime = 0%
        // else (maxTime - timeTaken) / (maxTime - minTime)
        let timePercent = 0;
        if (solution.timed) {
          if (data.timeTaken <= solution.minTime) {
            timePercent = 1;
          } else if (data.timeTaken >= solution.maxTime) {
            timePercent = 0;
          } else {
            timePercent = (solution.maxTime - data.timeTaken) / (solution.maxTime - solution.minTime);
          }
          score = timePercent * solution.maxScore;
        }

        // retain rawScore before penalization
        const rawScore = score;

        // subtract hints used from score
        score = score - data.hintsPenalty;

        // compute overall total score
        const overallTotalScore = game.get("totalScore") + score;

        // update gameData object
        // const currentGameData = game.get('gameData');
        // currentGameData.
        // console.log("Game data: " + );
        // update game record and add gameData/score record {gameData > answer, hintsPenalty, hintsUsed, puzzle, rawScore, solutionsType, time}

        await gameRef.update({
          gameData: firestore.FieldValue.arrayUnion({
            answer: data.answer,
            hintsPenalty: data.hintsPenalty,
            hintsUsed: data.hintsUsed,
            puzzle: data.puzzleRef,
            rawScore: rawScore,
            solutionType: solution.solutionType,
            time: data.timeTaken,
            totalScore: score,
          }),
          stage: solution.next,
          totalScore: overallTotalScore,
        });

        return {
          gameId: game.id,
          answer: data.answer,
          puzzle: data.puzzleRef,
          solutionType: solution.solutionType,
          hintsUsed: data.hintsUsed,
          hintsPenalty: data.hintsPenalty,
          next: solution.next,
          score: score,
          time: data.timeTaken,
          rawScore: rawScore,
          puzzle_TotalScore: score,
          overall_TotalScore: overallTotalScore,
        };
      } else {
        return {
          error: "Wrong answer",
        };
      }
    });
