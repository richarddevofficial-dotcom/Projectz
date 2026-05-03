const { body, validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body("name").notEmpty().withMessage("Name is required").isLength({ min: 2 }),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validateRequest,
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
];

const productValidation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 }),
  body("category").isIn(["men", "women", "kids", "accessories"]),
  body("stock").isInt({ min: 0 }),
  validateRequest,
];

module.exports = { registerValidation, loginValidation, productValidation };
