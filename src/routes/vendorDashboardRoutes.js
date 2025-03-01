const express = require("express");
const {} = require("../controllers/vendorDashboardController.js");

const router = express.Router();

router.get("/get-all-properties", getProperties);
router.get("/get-property/:propertyName", getProperty);

router.get("/get-all-projects", getProjects);
router.get("/get-property/:projectName", getProject);

router.post("/create-property", createProperty);
router.post("/create-project", createProject);

router.patch("/update-property/:propertyID", updateProperty);
router.patch("/update-project/:projectID", updateProject);

router.delete("/delete-property/:propertyID", deleteProperty);
router.delete("/delete-project/:projectID", deleteProject);

module.exports = router;
