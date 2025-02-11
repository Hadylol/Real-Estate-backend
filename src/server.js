const app = require("./app.js");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 4000;
//starting Move in app

app.listen(PORT, () => {
  console.log(`Server is on port ${PORT}`);
});
