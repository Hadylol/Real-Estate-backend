const { createClient } = require("@supabase/supabase-js");

const dotenv = require("dotenv");

dotenv.config();

const dbKEY = process.env.DB_KEY;
const dbURL = process.env.DB_URL;

if (!dbKEY || !dbKEY) {
  throw new Error("Missing Data Base Key or URL");
}

const supabase = createClient(dbURL, dbKEY);

module.exports = { supabase };
