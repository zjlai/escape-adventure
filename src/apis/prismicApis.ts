import { usePrismic } from '@prismicio/vue';

const { client } = usePrismic();

const apiService = () => {
  const getPuzzle = async (id: string) => {
    const doc = await client.getByID(id)
    console.log(doc)
    return doc
  }
  return {
    getPuzzle
  }
}

export {
  apiService
}