import fetch from "node-fetch";

async function run() {
  const res = await fetch("http://localhost:3000/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "upload/initialize", payload: "test.jpg" })
  });
  console.log("Status:", res.status);
  console.log(await res.text());
}
run();
