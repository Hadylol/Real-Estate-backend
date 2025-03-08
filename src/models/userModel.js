const { supabase } = require("../DB/connect.js");

const userModel = {
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
  async getUserLogin(userEmail) {
    const { data, error } = await supabase
      .from("users")
      .select(`user_id,email,name,is_verified , role,password`)
      .eq("email", userEmail);
    if (error && error.code != "PGRST116") {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
    if (error)
      throw new Error(`Failed to fetch login  cedentials: ${error.message}`);
    return data;
  },
  async getUserByEmail(userEmail) {
    const { data, error } = await supabase
      .from("users")
      .select(`user_id ,email , name, is_verified,role`)
      .eq("email", userEmail);
    if (error && error.code !== "PGRST116") {
      // Allow no row found error to pass as null
      throw new Error(`Error fetching user by email: ${error.message}`);
    }

    if (error) throw new Error(`Failed to fetch The user By Email`);
    console.log("this is the user ", data);
    return data;
  },
  async getUserByName(user_name) {
    const { data, error } = await supabase
      .from("users")
      .select("name")
      .eq("name", user_name);
    if (error)
      throw new Error(`Failed to Fetch the Full Name :${error.message}`);
    return data;
  },
  async createUser(user) {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select("*");
    if (error) throw new Error(`Failed to Create User : ${error.message}`);
    return data;
  },
  async getUserByVerificationCode(verificationCode) {
    const timeStamp = new Date().toISOString();
    const { data, error } = await supabase
      .from("users")
      .select(`user_id `)
      .eq("verification_token", verificationCode)
      .gt("verification_token_expiry", timeStamp)
      .single();
    if (!data) {
      throw new Error(
        `Invalid or expired Verification code, Please Try agian..`
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
    userID
  ) {
    const { data, error } = await supabase
      .from("users")
      .update({
        is_verified: is_verified,
        verification_token: verificationToken,
        verification_token_expiry: verificationTokenExpiry,
      })
      .eq("user_id", userID)
      .select(`user_id, email,name,role,is_verified`);
    //handle ths in the controller
    if (!data) {
      throw new Error(`No user Found `);
    }
    if (error)
      throw new Error(`Failed to Updated Verified User: ${error.message}`);
    console.log(data);
    return data;
  },
  async updateUserForgetPassword(
    resetPasswordToken,
    resetPasswordExpire,
    userID
  ) {
    const { data, error } = await supabase
      .from("users")
      .update({
        reset_Password_token: resetPasswordToken,
        reset_password_token_expiry: resetPasswordExpire,
      })
      .eq("user_id", userID)
      .select("*");
    if (error)
      throw new Error(`Failed to Updated user Reset Password ${error.message}`);
    return data;
  },
  async getUserByPasswordToken(resetPasswordToken) {
    const timeStamp = new Date().toISOString();
    const { data, error } = await supabase
      .from("users")
      .select("user_id")
      .eq("reset_Password_token", resetPasswordToken)
      .gt("reset_password_token_expiry", timeStamp)
      .single();
    if (error) throw new Error(`Failed to get User by Token `);
    console.log(data);
    return data;
  },
  async updateUserPassword(hashPassword, userID) {
    const { data, error } = await supabase
      .from("users")
      .update({
        password: hashPassword,
        reset_Password_token: null,
        reset_password_token_expiry: null,
      })
      .eq("user_id", userID)
      .select(`user_id,email,name,role,is_verified`);
    if (error)
      throw new Error(`Failed to updated User password..${error.message}`);
    console.log(data);
    return data;
  },
};

module.exports = { userModel };
