import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const dbKEY = process.env.DB_KEY;
const dbURL = process.env.DB_URL;

if (!dbKEY || !dbKEY) {
  throw new Error("Missing Data Base Key or URL");
}

const supabase = createClient(dbURL, dbKEY);

export default supabase;
