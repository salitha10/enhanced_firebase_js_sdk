const { getFirestore, collection, getDocs, query, where, orderBy, limit } = require('firebase/firestore');

const databaseInstance = getFirestore();

const read = async ({ collectionName, filters = [], sorts = [], recordLimit = null }) => {
  const collectionRef = collection(databaseInstance, collectionName);

  let q = query(collectionRef);

  filters.forEach((filter) => {
    q = query(q, where(filter.key, filter.operator, filter.value));
  });

  sorts.forEach((sort) => {
    q = query(q, orderBy(sort.key, sort.direction));
  });

  if (recordLimit) q = query(q, limit(recordLimit));

  return (await getDocs(q)).docs.map((doc) => doc.data());
};

const write = async ({ collectionName, payload, filters = [] }) => {}

const update = async ({ collectionName, payload, filters = [] }) => {}

const remove = async ({ collectionName, filters = [] }) => {}

module.exports = { read, write, update, remove };
