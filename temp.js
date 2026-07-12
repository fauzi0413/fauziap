import "dotenv/config";
import { put } from "@vercel/blob";

async function run() {
  try {
    const blob = await put("test.txt", "hello world", { access: "public" });
    console.log("Success:", blob.url);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
