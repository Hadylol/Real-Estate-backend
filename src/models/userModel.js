import supabase from "../DB/connect.js";

export const userModel = {
  async getAllUsers() {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw new Error(`Failed to Fetch All users : ${error}`);
    return data;
  },
  async getUserByID(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw new Error(`Failed to Fetch User by ID : ${error} `);
    return data;
  },
  async getUserByEmail(userEmail) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", userEmail)
      .limit(1);
    if (error && error.code !== "PGRST116") {
      // Allow no row found error to pass as null
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
    if (error) throw error;
    return data;
  },
  async getUserByName(user_name) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("name", user_name);

    if (error) throw new Error(`Failed to Fetch the Full Name :${error}`);
    return data;
  },
  async createUser(user) {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select("*");
    if (error) throw error;
    return data;
  },
  async getUserByVerificationCode(verificationCode) {
    const timeStamp = new Date().toISOString();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("verification_token", verificationCode)
      .gt("verification_token_expiry", timeStamp)
      .single();
    if (!data) {
      throw new Error(`No user found`);
    }
    console.log("this is from get user by token", data);
    if (error) throw new Error(`Failed to Fetch Verification Code : ${error}`);

    return data;
  },
};
