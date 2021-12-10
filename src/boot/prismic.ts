import { boot } from 'quasar/wrappers';
import { createPrismic } from '@prismicio/vue';

const prismic = createPrismic({
  endpoint: 'https://escapeadventure.prismic.io/api/v2',
})

export default boot(({ app }) => {
    app.use(prismic);
  });
  
