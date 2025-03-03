const { propertyModel } = require("../models/propertyModel");

const fetchProperties = async (req, res) => {
  try {
    const [properties] = await propertyModel.getProperties();
    return res.status(200).json({
      success: true,
      propreties: { properties },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const fetchProperty = async (req, res) => {
  try {
  } catch {}
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
  try {
    const [property] = await propertyModel.createProperty({
      name,
      description,
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
    return res.status(201).json({
      success: true,
      message: "Property Created!",
      property: {
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
  } catch {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = { fetchProperties, fetchProperty, createProperty };
