import dotenv from "dotenv";
import { app } from "./src/app.ts";
import cors from 'cors'


dotenv.config();

app.options('*', cors())
app.use(cors())
const PORT = process.env.SERVER_PORT || 5001;


app.listen(PORT, () => {
  console.log(`Started server at:  http://localhost:${PORT}`);
});