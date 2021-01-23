import { CartProvider } from "context/CartContext";
import { OrderProvider } from "context/OrderContext";
import { ProductProvider } from "context/ProductContext";
import { UserProvider } from "context/UserContext";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Windmill } from "@windmill/react-ui";
import "./tailwind.output.css";
import { HelmetProvider } from "react-helmet-async";
import { ReviewProvider } from "context/ReviewContext";

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Windmill>
        <UserProvider>
          <ProductProvider>
            <ReviewProvider>
              <CartProvider>
                <OrderProvider>
                  <App />
                </OrderProvider>
              </CartProvider>
            </ReviewProvider>
          </ProductProvider>
        </UserProvider>
      </Windmill>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
