const express = require("express");
const {
  fetchProperties,
  fetchProperty,
  createProperty,
  deleteProperty,
  updateProperty,
  createProject,
  fetchProject,
  fetchProjects,
  updateProject,
  deleteProject,
} = require("../controllers/vendorDashboardController.js");
const { authenticateVendor } = require("../middlewares/authenticateVendor.js");
const { authenticate } = require("../middlewares/authenticate.js");
const router = express.Router();

router.use(authenticate);
router.use(authenticateVendor);

router.get("/properties", fetchProperties);
router.get("/properties/:propertyID", fetchProperty);

router.get("/get-all-projects", fetchProjects);
router.get("/get-project/:projectID", fetchProject);

router.post("/create-property", createProperty);
router.post("/create-project", createProject);

router.patch("/update-property/:propertyID", updateProperty);
router.patch("/update-project/:projectID", updateProject);

router.delete("/delete-property/:propertyID", deleteProperty);
router.delete("/delete-project/:projectID", deleteProject);

module.exports = router;
