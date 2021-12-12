import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from 'src/boot/firebase'

const functions = getFunctions(app, 'asia-northeast1')

const createGame = httpsCallable(functions, 'createGame')
const getPuzzle = httpsCallable(functions, 'getPuzzle')
const scoreAnwer = httpsCallable(functions, 'scoreAnswer')
const getHint = httpsCallable(functions, 'getHint')
const getHints = httpsCallable(functions, 'getHints')

export {
  createGame,
  getPuzzle,
  scoreAnwer,
  getHints,
  getHint
}