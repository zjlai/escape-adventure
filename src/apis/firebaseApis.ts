import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../boot/firebase'

const functions = getFunctions(app, 'asia-northeast1')

const createGame = httpsCallable(functions, 'createTeam')

export {
  createGame
}