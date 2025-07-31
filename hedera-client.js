require('dotenv').config();
const { Client } = require("@hashgraph/sdk");

const client = Client.forTestnet().setOperator(
  process.env.OPERATOR_ID,
  process.env.OPERATOR_KEY
);

module.exports = client;
