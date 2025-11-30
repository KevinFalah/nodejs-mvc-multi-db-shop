const port = 4000;
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const mongoConnect = require("./util/database").mongoConnect;

// const sequelize = require('./util/database');
// const Product = require('./models/product');
const User = require("./models/user");
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findUserById('69141235f4296885cd3613b9')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// app.use(errorController.get404);

// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//   // .sync({ force: true })
//   .sync()
//   .then(result => {
//     return User.findByPk(1);
//     // console.log(result);
//   })
//   .then(user => {
//     if (!user) {
//       return User.create({ name: 'Max', email: 'test@test.com' });
//     }
//     return user;
//   })
//   .then(user => {
//     // console.log(user);
//     return user.createCart();
//   })
//   .then(cart => {
//     app.listen(port);
//   })
//   .catch(err => {
//     console.log(err);
//   });

mongoConnect(() => {
  // const exampleId = '690869038fc7f8fb5e2e462a'
  // User.findUserById(exampleId)
  //   .then((user) => {
  //     if (!user) {
  //       const user = new User("user", "email@mail.com");
  //       return user.addUser();
  //     }
  //     return user
  //   })
  //   .then((user) => {
  //     app.listen(port);
  //   })
  //   .catch((err) => console.log(err, '<-er'));


  app.listen(port)
});
