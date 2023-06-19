import 'dotenv/config';
import createAccessKey from "./awsPuppeteer/index.js";

// Pass your username as an argument to the function below
createAccessKey(process.env.ACCOUNT_USERNAME);