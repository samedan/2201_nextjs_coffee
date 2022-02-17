var Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("coffee-stores");

console.log({ table });

const createCoffeStore = (req, res) => {
  console.log({ req });
  if (req.method === "POST") {
    res.json({ message: "POST message" });
  } else {
    res.json({ message: "GET message" });
  }
};

export default createCoffeStore;
