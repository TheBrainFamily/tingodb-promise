const collection = require('tingodb-promise')
const testCollection = collection('testCollection')

const testData = [
  {
    _id: 'testData1',
    test: 'test1'
  },
  {
    _id: 'testData2',
    test: 'test2'
  },
  {
    _id: 'testData3',
    test: 'test3'
  },
]

describe('limit', () => {
  it('limits documents received in find', async () => {
    await Promise.all(
      testData.map(async data => {
        testCollection.insert(data)
      })
    )
    const result = await testCollection.find({}).limit(2).toArray()
    expect(result.length).toEqual(2)
  })
})
