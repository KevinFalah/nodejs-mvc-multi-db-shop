const Product = require("../models/product");
const { formatDateIntl } = require("../util/func");

exports.getProducts = (req, res, next) => {
  Product.find().populate('userId', 'email') // <- populate the reference
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((products) => {
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products,
    });
  });
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart
  //       .getProducts()
  //       .then((products) => {
  //         res.render("shop/cart", {
  //           path: "/cart",
  //           pageTitle: "Your Cart",
  //           products: products,
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   })
  //   .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .addToCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });

  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prodId);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .reduceItemInCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));

  // let oldQuantity;
  // let fetchedCart;

  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     const product = products[0];
  //     oldQuantity = product.cartItem.quantity;
  //     console.log("===", product, "<- pridd");

  //     if (oldQuantity <= 1) {
  //       return product.cartItem.destroy();
  //     } else {
  //       oldQuantity -= 1;
  //       return fetchedCart.addProducts(product, {
  //         through: { quantity: oldQuantity },
  //       });
  //     }
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  
  req.user
  .addOrder()
  .then(() => {
    res.redirect("/orders");
  })
  .catch((err) => console.log(err));
  
  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     return req.user
  //       .createOrder()
  //       .then((order) => {
  //         return order.addProducts(
  //           products.map((product) => {
  //             product.orderItem = { quantity: product.cartItem.quantity };
  //             return product;
  //           })
  //         );
  //       })
  //       .catch((err) => console.log(err));
  //   })
  //   .then((result) => {
  //     return fetchedCart.setProducts(null);
  //   })
  //   .then((result) => {
  //     res.redirect("/orders");
  //   })
  //   .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        formatDate: formatDateIntl
      });
    })
    .catch((err) => {
      console.log(err);
    });

  //! Sequelize ways
  // req.user
  //   .getOrders({ include: ["products"] })
  //   .then((orders) => {
  //     const _orders = orders?.map((orderInstance) => {
  //       const orderPojo = orderInstance.get({ plain: true });

  //       const dateOrder = formatDateIntl(orderPojo?.createdAt);
  //       const totalPrice = orderPojo.products.reduce((sum, acc) => {
  //         return sum + acc?.price * acc?.orderItem?.quantity;
  //       }, 0);

  //       console.log(orderPojo.products);
  //       return {
  //         ...orderPojo,
  //         dateOrder,
  //         totalPrice,
  //       };
  //     });

  //     res.render("shop/orders", {
  //       path: "/orders",
  //       pageTitle: "Your Orders",
  //       orders: _orders,
  //     });
  //   })
  //   .catch((err) => console.log(err));
};
