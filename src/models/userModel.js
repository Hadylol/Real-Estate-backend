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
      .eq("email", userEmail);
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
      throw new Error(
        `Invalid or expired Verification code, Please Try agian..`,
      );
    }
    console.log("this is from get user by token", data);
    if (error) throw new Error(`Failed to Fetch Verification Code : ${error}`);

    return data;
  },
  async updateUserVerified(
    is_verified,
    verificationToken,
    verificationTokenExpiry,
    userID,
  ) {
    const { data, error } = await supabase
      .from("users")
      .update({
        is_verified: is_verified,
        verification_token: verificationToken,
        verification_token_expiry: verificationTokenExpiry,
      })
      .eq("user_id", userID)
      .select();
    console.log(userID);
    if (!data) {
      throw new Error(`No user Found `);
    }
    if (error)
      throw new Error(`Failed to Updated Verified User: ${error.message}`);
    console.log(data);
    return data;
  },
};
