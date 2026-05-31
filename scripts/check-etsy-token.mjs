import dotenv from "dotenv";
import { getAccessToken } from "../api/etsy/lib/token.js";

dotenv.config({ path: ".env" });

void (async () => {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.log(
        "No token: ensure ETSY_KEYSTRING, ETSY_REFRESH_TOKEN, and ETSY_SHOP_ID are set in .env",
      );
      process.exit(0);
    }
    console.log("Access token length:", token.length);
  } catch (err) {
    console.error("Error refreshing token:", err.message);
    process.exit(1);
  }
})();
