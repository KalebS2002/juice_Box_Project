const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/juicebox-dev");

module.exports = {
  client,
};

async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password, name, location) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `,
      [username, password, name, location]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username, name, location, active 
        FROM users;
      `
  );

  return rows;
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function createPost({ authorId, title, content }) {
  try {
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = {}) {
  try {
  } catch (error) {
    throw error;
  }
}

async function getAllPosts() {
  try {
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(
      `
        SELECT * FROM posts
        WHERE "authorId"=$1;
      `,
      [userId]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT id, username, name, location, active 
      FROM users
      WHERE id=${userId};
      `);

    if (!user) {
      return null;
    }

    user.posts = await getPostsByUser(userId);

    return user;
  } catch (error) {
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorId: albert.id,
      title: "First Post",
      content:
        "This is my first post. I hope I love writing blogs as much as I love writing them.",
    });

    // a couple more
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  createUser,
  getAllUsers,
  updateUser,
  createInitialPosts,
  getAllPosts,
  updatePost,
};
