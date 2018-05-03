const collection = require('tingodb-promise')
const testCollection = collection('testCollection')

const testData = [
  {
    _id: 'testData1',
    score: 2
  },
  {
    _id: 'testData2',
    score: 1
  },
  {
    _id: 'testData3',
    score: 3
  },
]
beforeAll(async() => {
  await Promise.all(
    testData.map(async data => {
      testCollection.insert(data)
    })
  )
})

test('find -> limit -> toArray', async () => {
  const result = await testCollection.find({}).limit(2).toArray()
  expect(result.length).toEqual(2)
})

test('find -> sort -> limit -> toArray', async() => {
  const result = await testCollection.find({}).sort({'score': -1}).limit(1).toArray()
  expect(result[0].score).toEqual(3)
})
