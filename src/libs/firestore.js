const { getFirestore, collection, doc, getDocs, setDoc, addDoc, deleteDoc, updateDoc, query, where, orderBy, limit } = require('firebase/firestore')

let databaseInstance

const initialize = (app) => {
  databaseInstance = getFirestore(app)
}

const read = async ({ collectionName, filters = [], sorts = [], recordLimit, onSuccess, onError }) => {
  let q = getFilteredQuery({ collectionName, filters, sorts })
  if (recordLimit) q = query(q, limit(recordLimit))
  return await request({ func: () => getDocs(q), onSuccess, onError })
}

const write = async ({ collectionName, documentId, payload, merge = false, onSuccess, onError }) => {
  let writeFunc
  if (documentId) writeFunc = () => setDoc(doc(databaseInstance, `${collectionName}/${documentId}`), payload, { merge })
  else writeFunc = () => addDoc(collection(databaseInstance, collectionName), payload)
  return await request({ func: writeFunc, onSuccess, onError })
}

const update = async ({ collectionName, payload, filters = [], onSuccess, onError }) => {
  return await updateOrDelete({ collectionName, filters, onSuccess, onError, func: (id) => updateDoc(doc(databaseInstance, collectionName, id), payload) })
}

const remove = async ({ collectionName, filters = [], onSuccess, onError }) => {
  return await updateOrDelete({ collectionName, filters, onSuccess, onError, func: (id) => deleteDoc(doc(databaseInstance, collectionName, id)) })
}

const getFilteredQuery = ({ collectionName, filters = [], sorts = [] }) => {
  const collectionRef = collection(databaseInstance, collectionName)

  let q = query(collectionRef)

  filters.forEach((filter) => {
    q = query(q, where(filter.key, filter.operator, filter.value))
  })

  sorts.forEach((sort) => {
    q = query(q, orderBy(sort.key, sort.direction))
  })

  return q
}

const request = async ({ func, onSuccess, onError }) => {
  return await func()
    .then((res) => {
      if (onSuccess) onSuccess(res)
      return {
        success: true,
        data: res || false,
      }
    })
    .catch((error) => {
      if (onError) onError(error)
      return {
        success: false,
        error: error || false,
      }
    })
}

const updateOrDelete = async ({ func, collectionName, filters = [], onSuccess, onError }) => {
  const res = await read({ collectionName, filters, onSuccess, onError })
  if (res.success) {
    const modifiedIds = []
    const errors = []
    await Promise.all(
      res.data.docs.map(async (document) => {
        await func(document.id)
          .then(() => {
            modifiedIds.push(document.id)
          })
          .catch((e) => {
            errors.push(e)
          })
      }),
    )
    if (errors.length > 0) {
      if (onError) onError(errors)
      return {
        success: false,
        error: errors,
        data: modifiedIds,
      }
    }
    if (onSuccess) onSuccess(modifiedIds)
    return { success: true, data: modifiedIds }
  }
  return res
}

module.exports = { initialize, read, write, update, remove }
