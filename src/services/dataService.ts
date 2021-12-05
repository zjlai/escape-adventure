// import { reactive } from 'vue'
import data from 'src/data/data.json'

const dataService = () => {
  const getPuzzle = (id: string) => {
    return data.puzzles.find(p => p.id === id)
  }
  return {
    getPuzzle
  }
}

export { dataService }