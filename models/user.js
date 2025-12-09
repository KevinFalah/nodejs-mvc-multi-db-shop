const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = require("../models/product");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

UserSchema.methods.addToCart = function (productId) {
  let quantity = 1;
  const cartItems = this.cart.items;

  const foundIndex = cartItems
    ? cartItems.findIndex((item) => item.productId.toString() === productId)
    : null;
  const itemCart = cartItems ? [...cartItems] : [];

  if (foundIndex >= 0) {
    quantity = itemCart[foundIndex]?.quantity + 1;
    itemCart[foundIndex].quantity = quantity;
  } else {
    itemCart.push({ productId, quantity });
  }

  const updatedCart = {
    items: itemCart,
  };

  this.cart = updatedCart;
  return this.save();
};

UserSchema.methods.reduceItemInCart = function (productId) {
      const cartItems = this.cart.items;
  
      const foundIndex = cartItems
        ? cartItems.findIndex((item) => item.productId.toString() === productId)
        : null;
      const itemCart = cartItems ? [...cartItems] : [];
  
      if (foundIndex >= 0) {
        const quantity = itemCart[foundIndex]?.quantity;
        if (quantity > 1) {
          itemCart[foundIndex].quantity = quantity - 1;
        } else {
          itemCart.splice(foundIndex, 1);
        }
  
        const updatedCart = {
          items: itemCart,
        };
  
        this.cart = updatedCart;
        return this.save();
      } else {
        throw Error("Item not found!");
      }
}

module.exports = mongoose.model("User", UserSchema);
