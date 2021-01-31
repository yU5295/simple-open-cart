const router = require("express").Router();
const pool = require("../db");
const verifyToken = require("../middleware/verifyToken");

router.route("/").get(async (req, res, next) => {
  const { product_id, user_id } = req.query;
  try {
    const reviewExist = await pool.query(
      "SELECT * FROM reviews where product_id = $1 and user_id = $2",
      [product_id, user_id]
    );
    const reviews = await pool.query(
      `SELECT users.fullname as name, * FROM reviews
        join users 
        on users.user_id = reviews.user_id
        WHERE product_id = $1`,
      [product_id]
    );
    res.status(200).json({
      // does current user's review available
      reviewExist: reviewExist.rowCount !== 0,
      reviews: reviews.rows,
    });
  } catch (error) {
    res.status(500).json(error);
  }
})
  .post(async (req, res) => {
    const { user_id, product_id, content, rating } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO reviews(user_id, product_id, content, rating) 
       VALUES($1, $2, $3, $4) returning *
      `,
        [user_id, product_id, content, rating]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json(error.detail);
    }
  })
  .put(async (req, res) => {
    const { content, rating, id } = req.body;

    try {
      const result = await pool.query(
        `UPDATE reviews set content = $1, rating = $2 where id = $3 returning *
      `,
        [content, rating, id]
      );
      res.json(result.rows);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

module.exports = router;
