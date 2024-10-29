import express from "express"
const app = express();

export const router = express.Router;

app.use(express.json());

module.exports = router;