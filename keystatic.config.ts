import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'zudebo34/zudebo34.github.io'
  },

  collections: {
    posts: collection({
      label: 'Posts',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: 'Title' }
        }),
        content: fields.markdoc({
          label: 'Content'
        })
      }
    })
  }
});
