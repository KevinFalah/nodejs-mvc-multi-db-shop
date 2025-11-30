// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

const getDb = require("../util/database").getDb;
const mongoDb = require("mongodb");
const { formatDateIntl } = require("../util/func");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; //! {items: []}
    this._id = id;
  }

  addUser() {
    const db = getDb();

    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("USER ADDED => ", result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findUserById(id) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongoDb.ObjectId(id) })
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err, "<< ERROR FINDUSER BY ID"));
  }

  //! Embedded Document Model.
  getCart() {
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

        const foundIndex = cartItems
          ? cartItems.findIndex(
              (item) => item.productId.toString() === _productId
            )
          : null;
        const itemCart = cartItems ? [...cartItems] : [];

        if (foundIndex >= 0) {
          itemCart.splice(foundIndex, 1);
        }
        const updatedCart = {
          items: itemCart,
        };

        db.collection("users").updateOne(
          { _id: this._id },
          { $set: { cart: updatedCart } }
        );

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

  addToCart(_productId) {
    const db = getDb();
    let quantity = 1;
    const productId = new mongoDb.ObjectId(_productId);
    const cartItems = this.cart.items;

    const foundIndex = cartItems
      ? cartItems.findIndex((item) => item.productId.toString() === _productId)
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

    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  reduceItemInCart(_productId) {
    const db = getDb();
    const cartItems = this.cart.items;

    const foundIndex = cartItems
      ? cartItems.findIndex((item) => item.productId.toString() === _productId)
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

      return db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
    } else {
      throw Error("Item not found!");
    }
  }
  //! End Embedded Document Model

  addOrder() {
    const db = getDb();

    return this.getCart()
      .then((products) => {
        const createdAt = new Date();

        const totalPrice = products.reduce((sum, acc) => {
          return sum + acc?.price * acc?.quantity;
        }, 0);

        const orders = {
          items: products,
          user: {
            _id: new mongoDb.ObjectId(this._id),
            name: this.name,
          },
          createdAt,
          totalPrice,
        };

        return db.collection("orders").insertOne(orders);
      })
      .then(() => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } })
          .then(() => console.log("Success Add order"))
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  getOrders() {
    const db = getDb();

    return db
      .collection("orders")
      .find({ "user._id": new mongoDb.ObjectId(this._id) })
      .toArray()
      .then((orders) => {
        console.log(orders, "<- orders");
        return orders;
      })
      .catch((err) => console.log(err));
  }
}

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING
// });

module.exports = User;
