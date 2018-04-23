const Db = require('tingodb')({memStore: true, searchInArray: true}).Db
const thenify = require('thenify')

module.exports = function (collectionName = 'collectionName') {
  const db = new Db('', {})

  const collection = db.collection(collectionName)

  const newCollection = {}
  const methods = ['findOne', 'count', 'update', 'remove']

  methods.forEach(method => {
    newCollection[method] = thenify(collection[method].bind(collection))
  })

  newCollection.insert = (...args) => {
    const originalInsert = thenify(collection.insert.bind(collection))
    return originalInsert(...args).then((res) => {
      const ids = res.map(doc => doc._id)
      //TODO the n might be wrong, also, how does this work with upsert?
      return { result: { ok: res.length, n: res.length }, ops: res, insertedCount: res.length, insertedIds: ids }
    })
  }
  newCollection.find = (...args) => {
    const cursor = collection.find(...args)
    let methods = ['toArray', 'skip']
    const newCursor = {}
    methods.forEach(method => {
      newCursor[method] = thenify(cursor[method].bind(cursor))
    })
    newCursor.each = cursor.each.bind(cursor)
    newCursor.sort = (...args) => {
      const sortCursor = cursor.sort(...args)

      const newSort = {
        toArray: thenify(sortCursor.toArray.bind(sortCursor))
      }
      return newSort
    }
    return newCursor
  }

  newCollection.distinct = (field, query) => {
    return newCollection
      .find(query)
      .toArray()
      .then(data => {
        const values = {};
        data.forEach(document => {
          values[document[field]] = true;
        });
        return Object.keys(values);
      });
  };

  return newCollection;
};
