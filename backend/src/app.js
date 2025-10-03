const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const morgan = require("morgan");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 👉 log tất cả request ra terminal
app.use(morgan("dev"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/task"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
