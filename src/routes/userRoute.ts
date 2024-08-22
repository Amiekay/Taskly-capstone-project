import express from "express";
const validateUser = require("../middleware/userMiddleware");

const router = express.Router();
const controller = require("../controllers/userController");

// Create user
router.post(
  "/signup/:organizationId",
  validateUser.ValidateUserCreationWithJoi,
  controller.createUser
);

// login user

router.post("/login", validateUser.LoginValidation, controller.login);

module.exports = router;
