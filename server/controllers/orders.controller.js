const pool = require("../db");

const createOrder = async (req, res, next) => {
  const { cartId, amount, itemTotal } = req.body;
  const userId = req.user.id;
  try {
    // create an order
    const order = await pool.query(
      "INSERT INTO orders(user_id, status, amount, total) VALUES($1, 'complete', $2, $3) returning *",
      [userId, amount, itemTotal]
    );

    // get order id of the newly created order
    const order_id = order.rows[0].order_id;

    // copy cart items from the current cart_item table into order_item table
    try {
      await pool.query(
        `
      INSERT INTO order_item(order_id,product_id, quantity) 
      SELECT $1, product_id, quantity from cart_item where cart_id = $2
      returning *
      `,
        [order_id, cartId]
      );

      // delete all items from cart_items table
      await pool.query("delete from cart_item where cart_id = $1", [cartId]);

      res.json(order.rows[0]);
    } catch (error) {
      res.status(500).send(error);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllOrders = async (req, res, next) => {
  const { page = 1 } = req.query;
  const userId = req.user.id;
  const limit = 5;
  const offset = (page - 1) * limit;
  try {
    const rows = await pool.query(
      "SELECT * from orders WHERE orders.user_id = $1",
      [userId]
    );
    const orders = await pool.query(
      `SELECT order_id, user_id, status, date::date, amount, total 
      from orders WHERE orders.user_id = $1 order by order_id desc limit $2 offset $3`,
      [userId, limit, offset]
    );
    res.json({ items: orders.rows, total: rows.rowCount });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getOrder = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const order = await pool.query(
      `SELECT products.*, order_item.quantity 
      from orders 
      join order_item
      on order_item.order_id = orders.order_id
      join products 
      on products.product_id = order_item.product_id 
      where orders.order_id = $1 AND orders.user_id = $2`,
      [id, userId]
    );
    res.json(order.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
};
