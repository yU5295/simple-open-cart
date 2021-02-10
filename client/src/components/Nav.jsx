import { Badge, Button, Dropdown, DropdownItem } from "@windmill/react-ui";
import { useCart } from "context/CartContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "services/auth.service";
import {Home, ShoppingCart, User} from "react-feather"

const Nav = () => {
  const { cartData } = useCart();
  const user = authService.getCurrentUser();
  const cartQuantity = cartData?.items.reduce((acc, cur) => {
    return acc + Number(cur.quantity);
  }, 0);
  const name = user?.fullname.split(" ")[0] + " " + user?.fullname.split(" ")[1];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
      <nav className="flex items-center justify-between px-2 lg:px-36 py-2 bg-gray-50 shadow-lg">
        <span className="text-gray-700 text-2xl font-bold dark:text-gray-400">
          <h1>PERN Store</h1>
        </span>
        <ul className="flex space-x-4">
          {!user && (
            <>
              <li>
                  <Link to="/signup">
                <Button layout="link">
                    signup
                </Button>
                    </Link>
              </li>
              <li>
                <Button layout="link">
                  <Link to="/login">login</Link>
                </Button>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                  <Link to="/">
                <Button layout="link">
                  <span className="lg:block hidden">Home</span>
                    <Home className="lg:hidden"/>
                </Button>
                    </Link>
              </li>
              <li>
                  <Link to="/cart">
                <Button layout="link">
                    <span className="lg:block hidden">Cart</span>
                    <ShoppingCart className="lg:hidden"/>
                     <Badge className="ml-2" type="danger">{cartQuantity || 0}</Badge>{" "}
                </Button>
                  </Link>
              </li>
              <li className="relative">
                <Button
                  layout="link"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="lg:block hidden">Account</span>
                  <User className="lg:hidden"/>
                </Button>
                <Dropdown align="right" isOpen={isDropdownOpen}>
                  <DropdownItem className="curosr-not-allowed text-gray-400 border-b flex flex-col items-start justify-start">
                    <p className="self-start">{name}</p>
                    <p className="self-start">@{user.username}</p>
                  </DropdownItem>
                  <DropdownItem tag="a">
                    <Link className="w-full" to="/profile">
                      Profile
                    </Link>
                  </DropdownItem>
                  <DropdownItem tag="a">
                    <Link className="w-full" to="/orders">
                      Orders
                    </Link>
                  </DropdownItem>
                  <DropdownItem tag="a" className="border-t">
                    <Link className="w-full" onClick={() => authService.logout()} to="/login">
                      <Button block>Logout</Button>
                    </Link>
                  </DropdownItem>
                </Dropdown>
              </li>
            </>
          )}
        </ul>
      </nav>
  );
};

export default Nav;
