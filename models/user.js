const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
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
};

UserSchema.methods.addOrder = function () {
  const createdAt = new Date();

  this.populate('cart.items.productId').then((user) => {
    const cartItems = user.cart.items || [];

    const totalPrice = cartItems.reduce((sum, acc) => {
    return sum + acc?.productId?.price * acc?.quantity;
  }, 0);

  console.log(totalPrice, cartItems)

  return this
  // const orders = {
  //   items: products,
  //   user: {
  //     _id: new mongoDb.ObjectId(this._id),
  //     name: this.name,
  //   },
  //   createdAt,
  //   totalPrice,
  // };

  // return db.collection("orders").insertOne(orders);

  // this.cart = { items: [] };
  // return db
  //   .collection("users")
  //   .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } })
  //   .then(() => console.log("Success Add order"))
  //   .catch((err) => console.log(err));
  })
  
};

module.exports = mongoose.model("User", UserSchema);
