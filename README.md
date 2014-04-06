Request cached
================


{
    main: {
        uri: 'serverUrl',
        qs: {
          id: 'userId'
        }
    },
    cache: {
        uri: 'cachedUrl'
    },
    save: {
        path: [userId, page].join('_')
    },
    request: {
      proxy: 'http://localhost:8880',
      encoding: 'utf8'
    }
}
