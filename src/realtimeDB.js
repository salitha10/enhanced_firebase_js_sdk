const { getDatabase, ref, child, get } = require('firebase/database')

let databaseInstance

const initialize = (app) => {
  databaseInstance = ref(getDatabase(app))
}

const read = async ({ path }) => {
  let result
  await get(child(databaseInstance, path))
    .then((snapshot) => {
      if (snapshot.exists()) result = snapshot.val()
    })
    .catch((error) => {
      result = error
    })
  return result
}

const write = async ({ path, payload }) => {}

const update = async ({ path, payload }) => {}

const remove = async ({ path }) => {}

module.exports = { initialize, read, write, update, remove }
