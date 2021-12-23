import { reactive } from 'vue'
import { HintsInterface, HintInterface } from 'src/index'

const runtimeData = reactive({
  time: 0,
  puzzleId: '',
  gameId: '',
  penalty: 0,
  hintsUsed: 0,
  hints: <HintsInterface>{},
  hintsRevealed:  <Record<string, HintInterface>>{}
})

const gameService = () => {
  const setTime = (time: number) => {
    runtimeData.time = time
    return time
  }
  const getTime = () => {
    return runtimeData.time
  }
  const setGameId = (id: string) => {
    runtimeData.gameId = id
    return id
  }
  const getGameId = () => {
    return runtimeData.gameId
  }
  const setPuzzleId = (id: string) => {
    runtimeData.puzzleId = id
    return id
  }
  const getPuzzleId = () => {
    return runtimeData.puzzleId
  }
  const incrementPenalty = (penalty: number) => {
    runtimeData.penalty += penalty.valueOf()
    return runtimeData.penalty
  }
  const getPenalty = () => {
    return runtimeData.penalty
  }
  const incrementHints = () => {
    runtimeData.hintsUsed++
    return runtimeData.hintsUsed
  }
  const getHintsUsed = () => {
    return runtimeData.hintsUsed
  }
  const saveHints = (hints: HintsInterface) => {
    runtimeData.hints = hints
    return runtimeData.hints
  }
  const retrieveHints = () => {
    return runtimeData.hints
  }
  const saveHint = (ref: string, hint: HintInterface) => {
    runtimeData.hintsRevealed[ref] = hint
    return runtimeData.hintsRevealed
  }
  const retrieveHint = (ref: string) => {
    return runtimeData.hintsRevealed[ref] ?? null
  }
  const reset = () => {
    runtimeData.hintsUsed = 0
    runtimeData.penalty = 0
    runtimeData.time = 0
    runtimeData.hints = <HintsInterface>{}
    runtimeData.hintsRevealed = <Record<string, HintInterface>>{}
  }
  return {
    setTime,
    getTime,
    setGameId,
    getGameId,
    setPuzzleId,
    getPuzzleId,
    incrementPenalty,
    getPenalty,
    incrementHints,
    getHintsUsed,
    saveHints,
    retrieveHints,
    saveHint,
    retrieveHint,
    reset
  }
}

export {
  gameService
}