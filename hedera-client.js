import "dotenv/config";
import { Client } from "@hashgraph/sdk";

const client = Client.forTestnet().setOperator(
	process.env.OPERATOR_ID,
	process.env.OPERATOR_KEY
);

export default client;
