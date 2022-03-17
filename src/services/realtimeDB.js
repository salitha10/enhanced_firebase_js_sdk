const { getDatabase, ref, child, get }  = require('firebase/database');

const databaseInstance = ref(getDatabase());

const read = async ({ path }) => {
    let result;
    await get(child(databaseInstance, path))
      .then((snapshot) => {
        if (snapshot.exists()) result = snapshot.val();
      })
      .catch((error) => {
        result = error;
      });
    return result;
};

const write = async ({ path, payload}) => {}

const update = async ({ path, payload}) => {}

const remove = async ({ path }) => {}

module.exports = { read, write, update, remove };
