import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from 'src/boot/firebase'

const functions = getFunctions(app, 'asia-northeast1')

const createGame = httpsCallable(functions, 'createTeam')
const getPuzzle = httpsCallable(functions, 'getPuzzle')
export {
  createGame,
  getPuzzle
}