import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from 'src/boot/firebase'

const functions = getFunctions(app, 'asia-northeast1')

const createGame = httpsCallable(functions, 'createGame')
const getPuzzle = httpsCallable(functions, 'getPuzzle')
const scoreAnswer = httpsCallable(functions, 'scoreAnswer')
const getHint = httpsCallable(functions, 'getHint')
const getHints = httpsCallable(functions, 'getHints')
const getContent = httpsCallable(functions, 'getContent')
const validateAnswer = httpsCallable(functions, 'validateAnswer')
const scoringText = httpsCallable(functions, 'scoringText')

export {
  createGame,
  getPuzzle,
  scoreAnswer,
  getHints,
  getHint,
  getContent,
  validateAnswer,
  scoringText
}