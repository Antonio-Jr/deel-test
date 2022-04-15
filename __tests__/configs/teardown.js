const { unlink } = require('fs/promises');
const path = require('path');

module.exports = async function () {
  await unlink(path.resolve(__dirname, "..", "..", "./jest.database.test.sqlite3"));
}