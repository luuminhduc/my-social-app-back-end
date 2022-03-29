const express = require("express");
require("dotenv").config();
const connect = require("./db/connect");
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(authRoute);
app.use(commentRoute);
app.use(postRoute);

const PORT = process.env.PORT || 4000;

connect().then(() => {
	app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`));
});
