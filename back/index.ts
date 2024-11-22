import dotenv from "dotenv";
import { app } from "./src/app.ts";

dotenv.config();
const PORT = process.env.SERVER_PORT || 5001;

app.listen(PORT, () => {
  console.log(`Started server at:  http://localhost:${PORT}`);
});