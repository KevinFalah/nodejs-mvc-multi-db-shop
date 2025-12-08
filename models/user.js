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
        productId: { type: Schema.Types.ObjectId, required: true },
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

UserSchema.methods.getCart = function () {
        const db = getDb();
    const cartItems = this.cart.items;
    const productIds = cartItems?.map((i) => i?.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        const productsNotFound = productIds?.filter(
          (pr) =>
            !products?.find((pr2) => pr2?._id.toString() === pr.toString())
        );

        console.log(productsNotFound, "<- not");

        //! continue clean cart 

        // const foundIndex = cartItems
        //   ? cartItems.findIndex(
        //       (item) => item.productId.toString() === _productId
        //     )
        //   : null;
        // const itemCart = cartItems ? [...cartItems] : [];

        // if (foundIndex >= 0) {
        //   itemCart.splice(foundIndex, 1);
        // }
        // const updatedCart = {
        //   items: itemCart,
        // };

        // db.collection("users").updateOne(
        //   { _id: this._id },
        //   { $set: { cart: updatedCart } }
        // );

        return products?.map((pr) => {
          const quantity =
            this.cart.items.find(
              (it) => it?.productId?.toString() === pr?._id?.toString()
            )?.quantity || 0;

          return {
            ...pr,
            quantity,
          };
        });
      });
}

module.exports = mongoose.model("User", UserSchema);
