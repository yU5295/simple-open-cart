const express = require("express");
const router = express.Router();
const pool = require("../db");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const results = await pool.query("select * from users");
      console.log(results.rows);
      res.status(200).json(results.rows);
    } catch (error) {
      console.log(error);
    }
  })
  .post(async (req, res) => {
    const { username, password, email, fullname } = req.body;

    try {
      const results = await pool.query(
        "INSERT INTO users(username, password, email, fullname) VALUES($1, $2, $3, $4) returning *",
        [username, password, email, fullname]
      );
      res.status(200).json({
        status: "success",
        data: results.rows[0],
      });
    } catch (error) {
      console.log(error);
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      const results = await pool.query(
        "select * from users where user_id = $1",
        [id]
      );
      console.log(results.rows);
      res.status(200).json(results.rows);
    } catch (error) {
      console.log(error);
    }
  })
  .put(async (req, res) => {
    const { username, password, email, fullname } = req.body;
    const { id } = req.params;
    try {
      const results = await pool.query(
        "UPDATE users set username = $1, password = $2, email = $3, fullname = $4 where user_id = $5 returning *",
        [username, password, email, fullname, id]
      );
      res.status(200).json(results.rows[0]);
    } catch (error) {
      console.log(error)
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      const results = await pool.query(
        "DELETE FROM users where user_id = $1 returning *",
        [id]
      );
      res.status(200).json(results.rows[0]);
    } catch (error) {
      console.log(error)
    }
  });

module.exports = router;
