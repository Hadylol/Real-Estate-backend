const express = require("express");
const {
  fetchProperties,
  fetchProperty,
  createProperty,
} = require("../controllers/vendorDashboardController.js");
const authenticateVendor = require("../middlewares/authenticateVendor.js");
const authenticate = require("../middlewares/authenticate.js");
const router = express.Router();

//router.use(authenticateVendor);
//router.use(authenticate);

router.get("/properties", fetchProperties);
router.get("/properties/:propertyName", fetchProperty);

//router.get("/get-all-projects", getProjects);
//router.get("/get-property/:projectName", getProject);

router.post("/create-property", createProperty);
//router.post("/create-project", createProject);

//router.patch("/update-property/:propertyID", updateProperty);
//router.patch("/update-project/:projectID", updateProject);

//router.delete("/delete-property/:propertyID", deleteProperty);
//router.delete("/delete-project/:projectID", deleteProject);

module.exports = router;
