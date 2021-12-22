import { firestore } from "firebase-admin";
import {fn, logger, ERROR} from "./firebaseInit";
import { scoringInterface, scoringGeoInterface } from "./scoring.d";
import * as geofire from "geofire-common";
import {getFirestore} from "firebase-admin/firestore";

const db = getFirestore();
/* scoringText - Test scripts for firebase functions:shell
CORRECT ANSWER (PERFECT SCORE)
scoringText({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzleRef', hintsPenalty: 0, answer: '10', hintsUsed: 0, timeTaken: 40})

WRONG ANSWER
scoringText({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzleRef', hintsPenalty: 0, answer: '5', hintsUsed: 0, timeTaken: 40})

CORRECT ANSWER (FRACTION OF TIME)
scoringText({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzleRef', hintsPenalty: 0, answer: '10', hintsUsed: 0, timeTaken: 120})

CORRECT ANSWER (PENALIZE HINTS)
scoringText({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzleRef', hintsPenalty: 2, answer: '10', hintsUsed: 1, timeTaken: 40})
*/

// Constants
const GAME_SOLUTIONS = "solutions";
const GAME_COLLECTION = "games";

export const scoringText = fn
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
  
  /* scoringTextMulti - Test scripts for firebase functions:shell
  CORRECT ANSWER (PERFECT SCORE)
  scoringTextMulti({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzle1', hintsPenalty: 0, answer: '["abc", "def"]', hintsUsed: 0, timeTaken: 40})
  
  CORRECT ANSWER (Duplicate Answer from User - should only get one part of the score correct)
  scoringTextMulti({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzle1', hintsPenalty: 0, answer: '["abc", "def", "def"]', hintsUsed: 0, timeTaken: 40})

  1 CORRECT, 1 WRONG ANSWER
  scoringTextMulti({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzle1', hintsPenalty: 0, answer: '["abc", "cba"]', hintsUsed: 0, timeTaken: 40})

  CORRECT ANSWER (FRACTION OF TIME)
  scoringTextMulti({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzle1', hintsPenalty: 0, answer: '["abc", "def"]', hintsUsed: 0, timeTaken: 120})

  CORRECT ANSWER (PENALIZE HINTS)
  scoringTextMulti({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'puzzle1', hintsPenalty: 2, answer: '["abc", "def"]', hintsUsed: 1, timeTaken: 40})
  */

  export const scoringTextMulti = fn
    .https
    .onCall(async (data: scoringInterface) => {
      // log incoming data
      logger.info(data);

      // get game session data from firestore
      const game = await db.collection(GAME_COLLECTION).doc(data.gameId).get();
      if (!game.exists) {
        console.log('Game Id not found');
        return {
          error: 'Game Id not found'
        }
      }

      // Get solutions/puzzle data      
      var answer = [''];
      var maxScore = 0;
      //var minScore = 0;
      var maxTime = 0;
      var minTime = 0;
      var next = "";
      var timed = false;
      var solutionType = "";
      await db.collection(GAME_SOLUTIONS).where("puzzleRef", "==", data.puzzleRef).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          answer = doc.get('answer');          
          maxScore = doc.get('maxScore');
          //minScore = doc.get('minScore');
          maxTime = doc.get('maxTime');
          minTime = doc.get('minTime');
          next = doc.get('next')
          timed = doc.get('timed')
          solutionType = doc.get('solutionType')
        })
      })
    

      // eliminate duplicate answers
      const answerArray = JSON.parse(data.answer);      
      var newAnswer = Array.from(new Set(answerArray));

      // initialize Scoring
      var score = 0;

      // check for correct answer (to move this into a separate module later, e.g., if boolean answer = true then proceed)
      var correctAnswer = 0;      
      console.log("New Answer = " + newAnswer + "; data.answer = " + data.answer + "; answerArray = " + answerArray);
      for(let j=0; j<newAnswer.length; j++) {
        for(let i=0; i<answer.length; i++) {        
          if(newAnswer[j] == answer[i]) {
            console.log ("Checking for the correct answer => " + answer[i] + " is equals to " + newAnswer[j] + ": TRUE");
            correctAnswer++;
          } else {
            console.log ("Checking for the correct answer => " + answer[i] + " is equals to " + newAnswer[j] + ": FALSE");
          }
        }
      }

      console.log("Number of correct answers = " + correctAnswer);

      if(true) {  // always true since this is an optional puzzle

        // reset maxScore based on how many correct answers
        maxScore = correctAnswer / answer.length * maxScore
        console.log("Max Score is now = " + maxScore);

        // fractionalize score by time taken, where
        // if timeTaken <= minTime = 100%
        // if timeTaken > maxTime = 0%
        // else (maxTime - timeTaken) / (maxTime - minTime)
        var timePercent = 0;
        if(timed) {
          if(data.timeTaken <= minTime) {
            timePercent = 1
          } else if (data.timeTaken >= maxTime) {
            timePercent = 0
          } else {
            timePercent = (maxTime - data.timeTaken) / (maxTime - minTime)
          }
          
          score = timePercent * maxScore;
        }

        // retain rawScore before penalization
        var rawScore = score;
        
        // subtract hints used from score
        score = score - data.hintsPenalty;

        // compute overall total score 
        var overallTotalScore = game.get('totalScore') + score;

        // update game record and add gameData/score record {gameData > answer, hintsPenalty, hintsUsed, puzzle, rawScore, solutionsType, time}                
        await db.collection(GAME_COLLECTION).doc(data.gameId).update({
          gameData: firestore.FieldValue.arrayUnion({
            answer: data.answer,
            hintsPenalty: data.hintsPenalty,
            hintsUsed: data.hintsUsed,
            puzzle: data.puzzleRef,
            rawScore: rawScore,
            solutionType: solutionType,
            time: data.timeTaken,
            totalScore: score
          }),
          stage: next,
          totalScore: overallTotalScore
        });

        return {
          gameId: game.id,
          answer: data.answer,
          puzzle: data.puzzleRef,
          solutionType: solutionType,
          hintsUsed: data.hintsUsed,
          hintsPenalty: data.hintsPenalty,
          next: next,
          score: score,
          time: data.timeTaken,
          rawScore: rawScore,
          puzzle_TotalScore: score,
          overall_TotalScore: overallTotalScore
        };
      }
    });

/* scoringGeo - Test scripts for firebase functions:shell
CORRECT ANSWER (PERFECT SCORE)
scoringGeo({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'geoPuzzle1', hintsPenalty: 0, answer: [1, 0], hintsUsed: 0, timeTaken: 40})

CORRECT ANSWER (Distance shy of actual answer, but within maxDistKm)
scoringGeo({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'geoPuzzle1', hintsPenalty: 0, answer: [1, 0.1], hintsUsed: 0, timeTaken: 40})

WRONG ANSWER (Distance outside maxDistKm, resulting in zero score)
scoringGeo({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'geoPuzzle1', hintsPenalty: 0, answer: [30, 30], hintsUsed: 0, timeTaken: 40})

CORRECT ANSWER (FRACTION OF TIME)
scoringGeo({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'geoPuzzle1', hintsPenalty: 0, answer: [1, 0], hintsUsed: 0, timeTaken: 500})

CORRECT ANSWER (PENALIZE HINTS)
scoringGeo({gameId: 'Zmbfcdc5yzfoetZr85Ro', puzzleRef: 'geoPuzzle1', hintsPenalty: 20, answer: [1, 0], hintsUsed: 1, timeTaken: 40})
*/

export const scoringGeo = fn
    .https
    .onCall(async (data: scoringGeoInterface) => {
      // log incoming data
      logger.info(data);

      // get game session data from firestore
      const game = await db.collection(GAME_COLLECTION).doc(data.gameId).get();
      if (!game.exists) {
        console.log('Game Id not found');
        return {
          error: 'Game Id not found'
        }
      }
      
      // Get solutions/puzzle data      
      var answer = new firestore.GeoPoint(0, 0);
      var maxScore = 0;
      //var minScore = 0;
      var maxTime = 0;
      var minTime = 0;
      var next = "";
      var timed = false;
      var solutionType = "";
      var maxDistKm = 0;
      await db.collection(GAME_SOLUTIONS).where("puzzleRef", "==", data.puzzleRef).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          answer = doc.get('answer');
          console.log("Coord is " + answer.longitude + ", " + answer.latitude);
          maxScore = doc.get('maxScore');
          maxDistKm = doc.get('maxDistKm');
          //minScore = doc.get('minScore');
          maxTime = doc.get('maxTime');
          minTime = doc.get('minTime');
          next = doc.get('next')
          timed = doc.get('timed')
          solutionType = doc.get('solutionType')
        })
      })
    
      // initialize Scoring
      var score = 0;
      maxScore = maxScore + 0;
      maxTime = maxTime;
      minTime = minTime;
      next = next;
      timed = timed;
      solutionType = solutionType;
      maxDistKm = maxDistKm;
      
      // check for geo distance between user input and solution answer (to move this into a separate module later, e.g., if boolean answer = true then proceed)            
      var correctAnswer = true; // no answer is wrong, just different scores, therefore always true
      const distInKm = geofire.distanceBetween(data.answer as unknown as number[], [answer.latitude, answer.longitude]);

      console.log ("Checking for the correct answer => " + data.answer + " is " + distInKm + "km away from " + answer.latitude + ", " + answer.longitude);

      if(correctAnswer) {

        //fracitionalize score by distance to geo answer, where maxDistKm is the maximum distance before zero score is awarded
        if (distInKm > maxDistKm)
          score = 0
        else
          score = (maxDistKm - distInKm) / maxDistKm * maxScore        

        console.log("Score for distancing is " + score);

        // fractionalize score by time taken, where
        // if timeTaken <= minTime = 100%
        // if timeTaken > maxTime = 0%
        // else (maxTime - timeTaken) / (maxTime - minTime)
        var timePercent = 0;
        if(timed) {
          if(data.timeTaken <= minTime) {
            timePercent = 1
          } else if (data.timeTaken >= maxTime) {
            timePercent = 0
          } else {
            timePercent = (maxTime - data.timeTaken) / (maxTime - minTime)
          }
          
          score = timePercent * score;
        }

        // retain rawScore before penalization
        var rawScore = score;
        
        // subtract hints used from score
        score = score - data.hintsPenalty;

        // compute overall total score 
        var overallTotalScore = game.get('totalScore') + score;

        // update game record and add gameData/score record {gameData > answer, hintsPenalty, hintsUsed, puzzle, rawScore, solutionsType, time}                
        await db.collection(GAME_COLLECTION).doc(data.gameId).update({
          gameData: firestore.FieldValue.arrayUnion({
            answer: data.answer,
            hintsPenalty: data.hintsPenalty,
            hintsUsed: data.hintsUsed,
            puzzle: data.puzzleRef,
            rawScore: rawScore,
            solutionType: solutionType,
            time: data.timeTaken,
            totalScore: score
          }),
          stage: next,
          totalScore: overallTotalScore
        });

        return {
          gameId: game.id,
          answer: data.answer,
          puzzle: data.puzzleRef,
          solutionType: solutionType,
          hintsUsed: data.hintsUsed,
          hintsPenalty: data.hintsPenalty,
          next: next,
          score: score,
          time: data.timeTaken,
          rawScore: rawScore,
          puzzle_TotalScore: score,
          overall_TotalScore: overallTotalScore
        };

      } else {
        return {
          error: 'Wrong answer'
        }
      }    

    });
