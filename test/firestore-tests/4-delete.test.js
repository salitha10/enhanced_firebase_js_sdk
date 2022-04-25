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

describe('Delete', () => {
  test('Empty user collection', async () => {
    const res = await firestoreService.remove({ collectionName: 'users' })
    expect(res.success).toBe(true)
  })
})
