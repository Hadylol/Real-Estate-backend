const { supabase } = require("../DB/connect");

const projectModel = {
  async getProject(projectId, userId) {
    const { data: projectData, error: projectError } = await supabase
      .from("project")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .maybeSingle();
    if (projectError)
      throw new Error(`Failed to fetch the Project ${projectError.message}`);
    if (!projectData) return null;
    propertyData = await projectModel.fetchPropertiesForProject(
      projectId,
      userId
    );

    return {
      ...projectData,
      properties: propertyData,
    };
  },
  async getProjects(userId) {
    const { data, error } = await supabase
      .from("project")
      .select("*")
      .eq("user_id", userId);
    if (error)
      throw Error(`Failed to Fetch all the Projects ${error.message} `);
    return data;
  },
  async createProject(project, projectProperties) {
    const { data: projectData, error: projectError } = await supabase
      .from("project")
      .insert(project)
      .select("*")
      .single();
    if (projectError)
      throw new Error(`Failed to Create the Project ${projectError.message}`);
    console.log(projectData);

    const propertiesWithProjectId = projectProperties.map((prop) => ({
      ...prop,
      project_id: projectData.project_id,
    }));
    // console.log(propertiesWithProjectId);
    const propertyData = await this.createPropertyForProject(
      propertiesWithProjectId
    );
    return { project: projectData, properties: propertyData };
  },
  async createPropertyForProject(properties) {
    const { data: propertyData, error: propertyError } = await supabase
      .from("properties")
      .insert(properties)
      .select("*");
    if (propertyError)
      throw new Error("Failed to Create Properties for Project");
    return propertyData;
  },
  async fetchPropertiesForProject(projectID, userId) {
    console.log(projectID);
    console.log(userId);
    const { data: propertyData, error: propertyError } = await supabase
      .from("properties")
      .select("*")
      .eq("project_id", projectID)
      .eq("user_id", userId);
    if (propertyError)
      throw new Error(
        `Failed to fetch Properties for Project ${propertyError.message}`
      );
    return propertyData;
  },
};

module.exports = projectModel;
