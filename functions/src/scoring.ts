const functions = require('firebase-functions');
import { firestore } from "firebase-admin";
import { fn, db } from "./index";
import { scoringInterface } from "./scoring.d";

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
      functions.logger.info(data);

      // get game session data from firestore
      const game = await db.collection(GAME_COLLECTION).doc(data.gameId).get();
      if (!game.exists) {
        console.log('Game Id not found');
        return {
          error: 'Game Id not found'
        }
      }
      
      // Get solutions/puzzle data      
      var answer = "";
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
    
      // initialize Scoring
      var score = 0;

      // check for correct answer (to move this into a separate module later, e.g., if boolean answer = true then proceed)
      console.log ("Checking for the correct answer => " + data.answer + " is equals to " + answer);

      var correctAnswer = false;
      if(data.answer == answer)
        correctAnswer = true;

      if(correctAnswer) {
        
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

      } else {
        return {
          error: 'Wrong answer'
        }
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
      functions.logger.info(data);

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

