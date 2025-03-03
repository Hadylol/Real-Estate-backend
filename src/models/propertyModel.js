const { supabase } = require("../DB/connect");

const propertyModel = {
  async getProperty(propertyName) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("name", propertyName)
      .single();
    if (error)
      throw new Error(`Failed to fetch the Property by name "${error.message}`);
    return data;
  },
  async getProperties() {
    const { data, error } = await supabase.from("properties").select("*");
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
  async updateProperty() {},
  async deleteProperty() {},
};

module.exports = { propertyModel };
