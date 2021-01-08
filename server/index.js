require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const morgan = require("morgan");

const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production'
const origin = {
  origin: isProduction ? 'https://nameless-journey-88760.herokuapp.com' : '*',
}

const users = require("./routes/users");
const product = require("./routes/product");
const order = require("./routes/order");
const cart = require("./routes/cart");
const auth = require("./auth");

const app = express();

app.use(cors(origin));
app.use(express.json());


app.use(morgan("dev"));

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/products", product);
app.use("/api/orders", order);
app.use("/api/cart", cart);

app.get("/api", async (req, res, next) => {
  try {
    const results = await pool.query("select * from users");
    console.log(results.rows);
  } catch (error) {
    console.log(error);
  }
  res.json({
    status: "success",
  });
});

app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({ status: error.status, stack: error.stack, message: error.message });
});

app.listen(PORT, () => console.log("Magic happening on port:", +PORT));
