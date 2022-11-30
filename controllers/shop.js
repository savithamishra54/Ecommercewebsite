const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      // console.log(products)
      res.json({products , success:true})
      // res.render('shop/product-list', {
      //   prods: products,
      //   pageTitle: 'All Products',
      //   path: '/products'
      // });
    })
    .catch(err => {
      console.log(err);
    });
};
 
exports.limitProducts = (req, res, next) => {
let page = Number(req.query.page);
let Limit = 2;

  Product.findAll({limit:2,offset:Limit*page})
    .then(products => {
      res.json({products , success:true})
      // res.render('shop/product-list', {
      //   prods: products,
      //   pageTitle: 'All Products',
      //   path: '/products'
      // });
    })
    .catch(err => {
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
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          // console.log(products)
          res.status(200).json({products , success:true})
          // res.render('shop/cart', {
          //   path: '/cart',
          //   pageTitle: 'Your Cart',
          //   products: products
          // });
        })
        .catch(err =>  res.status(500).json({success:false , message:err}));
    })
    .catch(err=>{
      res.status(500).json({success:false , message:err})
    });
};

exports.postCart = (req, res, next) => {
  if(!req.body.productId) {
    return res.status(400).json({success:false ,  message:'Product id is missing'})
  }
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
       res.status(200).json({success: true, message:'Product Successfully Added'})
      })
    .catch((err) =>{
      res.status(500).json({success:false , message: 'Error Occured'});
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.params.id;
  // console.log("prodId-----------",prodId)
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(async(products) => {
      let cart = await req.user.getCart()
      const product =  products[0];
      return CartItem.destroy({where:{productId:product.id,cartId:cart.id}});
    })
    .then(result => {
      res.status(200).json({data:result,success:true})
    })
    .catch((err)=>{
      res.status(500).json({success:false , message: 'Error Occured'});
    });
};

// exports.getOrders = (req, res, next) => {
//   res.render('shop/orders', {
//     path: '/orders',
//     pageTitle: 'Your Orders'
//   });
// };

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
