const { initializeFirebase, fillFirestore, resetFirestore } = require('../testBase')
const { firestoreService } = require('../..')

let app

beforeAll(() => {
  app = initializeFirebase()
  firestoreService.initialize(app)
  fillFirestore()
})

afterAll((done) => {
  resetFirestore()
  done()
})

describe('Read', () => {
  test('Read users collection', async () => {
    const res = await firestoreService.read({ collectionName: 'users' })
    expect(res.success).toBe(true)
  })
})
