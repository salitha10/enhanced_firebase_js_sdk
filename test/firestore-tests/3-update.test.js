const { initializeFirebase, fillFirestore, resetFirestore } = require('../testBase')
const { firestoreService } = require('../../src')

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

describe('Update', () => {
  const filters = [
    {
      key: 'name',
      operator: '==',
      value: 'Akalanka',
    },
  ]
  // Read and check value before update
  test('Pre-read', async () => {
    const res = await firestoreService.read({
      collectionName: 'users',
      filters: filters,
    })
    expect(res.success).toBe(true)
    expect(res.data.docs[0].data().age).toBe(19)
  })
  // Update record
  test('Update user record', async () => {
    const res = await firestoreService.update({
      collectionName: 'users',
      payload: { age: 20 },
      filters: filters,
    })
    expect(res.success).toBe(true)
  })
  // Read and check value after update
  test('Post-read', async () => {
    const res = await firestoreService.read({
      collectionName: 'users',
      filters: filters,
    })
    expect(res.success).toBe(true)
    expect(res.data.docs[0].data().age).toBe(20)
  })
})
