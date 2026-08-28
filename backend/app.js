  const express = require("express")
  const cors = require("cors")

  const app = express();

  app.use(cors(
  {
    origin: "https://i-wproject.vercel.app",
      credentials: true
  }
  ))

  app.use(express.json())

  module.exports = app;