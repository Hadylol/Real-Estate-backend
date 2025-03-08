const { propertyModel } = require("../models/propertyModel");

const fetchProperties = async (req, res) => {
  try {
    userID = req.user.userID;
    console.log(userID);
    const [properties] = await propertyModel.getProperties(userID);
    if (!properties) {
      return res.status(404).json({
        success: false,
        message: "No properties Found",
      });
    }
    res.status(200).json({
      success: true,
      propreties: { properties },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const fetchProperty = async (req, res) => {
  try {
    const { propertyID } = req.params;

    if (!propertyID) {
      return res.status(400).json({
        success: false,
        message: "Invalid request..",
      });
    }
    const user = req.user.userID;
    console.log(propertyID, user);
    const [property] = await propertyModel.getProperty(propertyID, user);
    console.log(property);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    res.status(201).json({
      success: true,
      message: "this is the property ",
      property: { property },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `something went wrong  ${error}`,
    });
  }
};

const createProperty = async (req, res) => {
  const {
    name,
    type,
    surface,
    description,
    price,
    address,
    city,
    municipality,
  } = req.body;
  const propertyFields = [
    "name",
    "type",
    "surface",
    "description",
    "price",
    "address",
    "municipality",
  ];
  const missingFields = propertyFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Missing Requied fields",
      missingFields,
    });
  }
  //validate some fields

  //console.log(req.user);
  try {
    user = req.user.userID;
    const [property] = await propertyModel.createProperty({
      name,
      description,
      user_id: user,
      type,
      surface,
      price,
      address,
      city,
      municipality,
    });
    if (!property) {
      return res.status(500).json({
        success: false,
        message: "Failed to create a New Property",
      });
    }
    console.log(req.user.userID);
    return res.status(201).json({
      success: true,
      message: "Property Created!",
      property: {
        id: property.id,
        user: property.user,
        name: property.name,
        type: property.type,
        price: property.price,
        surface: property.surface,
        address: property.address,
        city: property.city,
        municipality: property.municipality,
        description: property.description,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateProperty = async (req, res) => {
  const { propertyID } = req.params;
  const userID = req.user.userID;
  const {
    name,
    type,
    price,
    surface,
    address,
    city,
    municipality,
    description,
  } = req.body;
  const fieldsMap = {
    name: name,
    type: type,
    price: price,
    surface: surface,
    address: address,
    city: city,
    municipality: municipality,
    description: description,
  };
  const arrFields = Object.entries(fieldsMap);
  const fitleredArrFields = arrFields.filter(
    ([key, value]) => typeof value != "undefined"
  );
  const fitleredFields = Object.fromEntries(fitleredArrFields);
  try {
    const updatedProperty = await propertyModel.updateProperty(
      propertyID,
      userID,
      fitleredFields
    );
    if (updatedProperty.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Not found or None to update",
      });
    }
    console.log(updatedProperty);
    res.status(200).json({
      success: true,
      message: `Property updated successfully`,
      updatedProperty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong ${error}`,
    });
  }
};
const deleteProperty = async (req, res) => {
  const { propertyID } = req.params;
  const userID = req.user.userID;
  try {
    const deletedProperty = await propertyModel.deleteProperty(
      propertyID,
      userID
    );
    if (deletedProperty.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }
    console.log(deletedProperty);
    res.status(200).json({
      success: true,
      message: "Proeperty deleted successfully",
      deletedProperty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong..${error}`,
    });
  }
};
module.exports = {
  fetchProperties,
  fetchProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
