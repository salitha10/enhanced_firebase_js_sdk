const { initializeFirebase, resetFirestore } = require('../testBase')
const { firestoreService } = require('../..')

let app

beforeAll(() => {
  app = initializeFirebase()
  firestoreService.initialize(app)
})

afterAll((done) => {
  resetFirestore()
  done()
})

describe('Write', () => {
  const name = 'Akalanka'
  const age = 19
  test('Add user to user collection', async () => {
    const res = await firestoreService.write({ collectionName: 'users', payload: { name, age } })
    expect(res.success).toBe(true)
  })
})
