import { Button, Card, CardBody } from "@windmill/react-ui";
import ReviewCard from "components/ReviewCard";
import Spinner from "components/Spinner";
import { useCart } from "context/CartContext";
import { useReview } from "context/ReviewContext";
import Layout from "layout/Layout";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import productService from "services/product.service";
import reviewService from "services/review.service";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { reviews, setReviews } = useReview(null);
  const { cartData, addItem } = useCart();

  const notify = (data) => {
    return toast.promise(data, {
      loading: "Adding to cart",
      success: "Item added to cart",
      error: "An error occured",
    });
  };

  const addToCart = (e) => {
    e.stopPropagation();
    notify(addItem(cartData?.cartId, product.product_id, 1));
  };

  useEffect(() => {
    productService
      .getProduct(id)
      .then((res) => {
        setProduct(res.data.product);
        return res.data.product;
      })
      .then((data) => {
        reviewService
          .getReviews(data.product_id)
          .then((data) => setReviews(data.data));
      });
  }, [id, setReviews]);

  if (!product || !reviews) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <Spinner size={150} loading={!product} />
        </div>
      </Layout>
    );
  }
  return (
    <Layout title={product.name}>
      <Card className="flex lg:flex-row flex-col border mt-20">
        <img
          className="sm:w-full md:w-1/2 lg:w-1/3 object-cover"
          src={product.image_url}
          alt={product.name}
        />
        <CardBody className="flex flex-col items-start">
          <p className="text-4xl font-semibold text-gray-600">{product.name}</p>
          <p className="mb-4">₦ {product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          <Button className="mt-4" onClick={(e) => addToCart(e)}>
            Add to cart
          </Button>
        </CardBody>
      </Card>
      <div className="flex">

      {reviews.reviews.map((review) => (
        <ReviewCard review={review} key={review.id} />
        ))}
        </div>
      <Toaster position="top-right" />
    </Layout>
  );
};

export default ProductDetails;
