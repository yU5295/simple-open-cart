import React, { createContext, useContext, useEffect, useState } from "react";
import cartService from "services/cart.service";
import { useUser } from "./UserContext";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState();
  const [cartSubtotal, setCartSubtotal] = useState(0)
  const [cartTotal, setCartTotal] = useState(0);
  const { isLoggedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true)
      cartService.getCart().then((res) => {
        setCartData(res?.data);
        setIsLoading(false)
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const quantity = cartData?.items?.reduce((acc, cur) => {
      return acc + Number(cur.quantity);
    }, 0);
    const totalAmt = cartData?.items.reduce((acc, cur) => {
      return acc + Number(cur.subtotal);
    }, 0);
    setCartSubtotal((totalAmt))
    setCartTotal(quantity);
  }, [cartData]);

  const addItem = async (productId, quantity) => {
    const { data } = await cartService.addToCart(productId, quantity);
    setCartData({ items: [...data.data] });
  };

  const deleteItem = (product_id) => {
    const { items } = cartData;
    cartService.removeFromCart(product_id).then(() => {
      const data = items.filter((item) => item.product_id !== product_id);
      setCartData({ ...cartData, items: data });
    });
  };

  const increment = async (product_id) => {
    const res = await cartService.increment(product_id);
    setCartData({ ...cartData, items: res.data });
    return res;
  };
  const decrement = async (product_id) => {
    const res = await cartService.decrement(product_id);
    setCartData({ ...cartData, items: res.data });
    return res;
  };

  return (
    <CartContext.Provider
      value={{
        isLoading,
        cartData,
        setCartData,
        addItem,
        deleteItem,
        increment,
        decrement,
        cartTotal,
        cartSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
