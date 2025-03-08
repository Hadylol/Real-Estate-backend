const { supabase } = require("../DB/connect");

const propertyModel = {
  async getProperty(propertyID, userID) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyID)
      .eq("user_id", userID);
    if (error)
      throw new Error(`Failed to fetch the Property by name "${error.message}`);
    return data;
  },
  async getProperties(userID) {
    console.log(`userID is  ${userID}`);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", userID);
    if (error) throw Error(`Failed to fetch all the Proprties`);
    return data;
  },
  async createProperty(property) {
    const { data, error } = await supabase
      .from("properties")
      .insert(property)
      .select("*");
    if (error) throw new Error(`Failed to Create property ${error.message}`);
    return data;
  },
  async updateProperty(propertyID, userID, fields) {
    // console.log(fields);
    // console.log(userID);
    // console.log(propertyID);
    const { data, error } = await supabase
      .from("properties")
      .update(fields)
      .eq("id", propertyID)
      .eq("user_id", userID)
      .select();
    if (error) throw new Error(`Failed to update proeprty ${error}`);
    return data;
  },
  async deleteProperty(propertyID, userID) {
    console.log(propertyID, userID);
    const { data, error } = await supabase
      .from("properties")
      .delete()
      .eq("id", propertyID)
      .eq("user_id", userID)
      .select();
    if (error) throw new Error(`Failed to Delete property ${error}`);
    return data;
  },
};

module.exports = { propertyModel };
