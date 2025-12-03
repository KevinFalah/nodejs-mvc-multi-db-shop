const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ProductSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  price: Number,
  imageUrl: String,
  description: String,
})


module.exports = mongoose.model('Product', ProductSchema);
// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

// const mongoDb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.id = id ? new mongoDb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;

//     const { id, ...dataProduct } = this;
  
//     if (id) {
//       console.log(this);
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: id }, { $set: dataProduct });
//     } else {
//       dbOp = db.collection("products").insertOne(dataProduct);
//     }
//     console.log(this);
//     return dbOp
//       .then((result) => {
//         console.log("RESULT SAVE PRODUCT => ", result);
//       })
//       .catch((err) => console.log(err));
//   }

//   static findAll() {
//     return getDb()
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((err) => console.log(err));
//   }

//   static findById(prodId) {
//     if (typeof prodId !== "string" || !mongoDb.ObjectId.isValid(prodId)) {
//       console.log("Invalid or missing prodId:", prodId);

//       return Promise.resolve(null);
//     }

//     const _prodId = new mongoDb.ObjectId(prodId);
//     return getDb()
//       .collection("products")
//       .find({ _id: _prodId })
//       .next()
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }

//   static deleteById(id) {
//     const db = getDb();

//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongoDb.ObjectId(id) })
//       .then(() => {
//         console.log("SUCCESSFULY DELETE PRODUCT");
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;
