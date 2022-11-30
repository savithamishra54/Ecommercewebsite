const express = require("express");
const orderController = require("../controllers/order");
const router = express.Router();


router.post("/Order", orderController.createOrder);

router.get('/Order',orderController.showOrder)

module.exports = router;