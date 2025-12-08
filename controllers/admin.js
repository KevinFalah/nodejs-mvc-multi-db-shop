const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userId: req.user,
  });

  product
    .save()
    .then(() => {
      console.log("Created product!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));

  //! Sequelize
  // req.user
  //   .createProduct({
  //     title: title,
  //     price: price,
  //     imageUrl: imageUrl,
  //     description: description
  //   })
  //   .then(result => {
  //     // console.log(result);
  //     console.log('Created Product');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // req.user
  //   .getProducts({ where: { id: prodId } })
  //   // Product.findByPk(prodId)
  //   .then(products => {
  //     const product = products[0];
  //     if (!product) {
  //       return res.redirect('/');
  //     }
  //     res.render('admin/edit-product', {
  //       pageTitle: 'Edit Product',
  //       path: '/admin/edit-product',
  //       editing: editMode,
  //       product: product
  //     });
  //   })
  //   .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title?.trim();
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl?.trim();
  const updatedDesc = req.body.description?.trim();

  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.updatedDesc = updatedDesc;

      product.save();
    })
    .then(() => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
  // Product.findByPk(prodId)
  //   .then(product => {
  //     product.title = updatedTitle;
  //     product.price = updatedPrice;
  //     product.description = updatedDesc;
  //     product.imageUrl = updatedImageUrl;
  //     return product.save();
  //   })
  //   .then(result => {
  //     console.log('UPDATED PRODUCT!');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
  // req.user
  //   .getProducts()
  //   .then(products => {
  //     res.render('admin/products', {
  //       prods: products,
  //       pageTitle: 'Admin Products',
  //       path: '/admin/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;

  Product.findByIdAndDelete(prodId)
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));

  // Product.deleteById(prodId)
  //   .then(() => {
  //     console.log("DESTROYED PRODUCT");
  //     res.redirect("/admin/products");
  //   })
  //   .catch((err) => console.log(err));
};
