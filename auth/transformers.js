const db = require("../db/queries");

const serializer = (user, done) => {
  done(null, user.id);
};

// Modify this for my use case
const deserializer = async (id, done) => {
  try {
    const user = await db.userByID(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
};

module.exports = {
  serializer,
  deserializer,
};
