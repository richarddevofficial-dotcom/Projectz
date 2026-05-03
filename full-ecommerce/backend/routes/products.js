const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");
const { productValidation } = require("../middleware/validation");

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, admin, productValidation, createProduct);
router.put("/:id", protect, admin, productValidation, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
