const pool = require("../config");

const getAllUsersDb = async () => {
  try {
    const { rows: users } = await pool.query("select * from users");
    return users;
  } catch (error) {
    throw error;
  }
};

const createUserDb = async ({ username, password, email, fullname }) => {
  try {
    const {
      rows: user,
    } = await pool.query(
      "INSERT INTO users(username, password, email, fullname) VALUES($1, $2, $3, $4) returning user_id",
      [username, password, email, fullname]
    );
    return user[0];
  } catch (error) {
    console.log(error.stack);
    throw error;
  }
};

const getUserByIdDb = async (id) => {
  try {
    const {
      rows: user,
    } = await pool.query(
      "select users.*, cart.id as cart_id from users join cart on cart.user_id = users.user_id where users.user_id = $1",
      [id]
    );
    return user[0];
  } catch (error) {
    throw error;
  }
};

const getUserByEmailDb = async (email) => {
  try {
    const {
      rows: user,
    } = await pool.query(
      "select users.*, cart.id as cart_id from users join cart on cart.user_id = users.user_id where email = $1",
      [email]
    );

    return user[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUserDb = async ({ username, password, email, fullname, id }) => {
  try {
    const {
      rows: user,
    } = await pool.query(
      "UPDATE users set username = $1, password = $2, email = $3, fullname = $4 where user_id = $5 returning *",
      [username, password, email, fullname, id]
    );
    return user[0];
  } catch (error) {
    throw error;
  }
};

const deleteUserDb = async (id) => {
  try {
    const {
      rows: user,
    } = await pool.query("DELETE FROM users where user_id = $1 returning *", [
      id,
    ]);
    return user[0];
  } catch (error) {
    throw error;
  }
};

const createUserGoogleDb = async ({ sub, given_name, email, name }) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO users(google_id,username, email, fullname) 
      VALUES($1, $2, $3, $4) ON CONFLICT (email) 
      DO UPDATE SET google_id = $1, fullname = $4 returning *`,
      [sub, given_name, email, name]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const changeUserPasswordDb = async (hashedPassword, email) => {
  try {
    return await pool.query(`update users set password = $1 where email = $2`, [
      hashedPassword,
      email,
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsersDb,
  getUserByIdDb,
  getUserByEmailDb,
  updateUserDb,
  createUserDb,
  createUserGoogleDb,
  deleteUserDb,
  changeUserPasswordDb,
};
