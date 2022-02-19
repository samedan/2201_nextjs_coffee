var Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("coffee-stores");

console.log({ table });

const createCoffeStore = async (req, res) => {
  console.log({ req });

  if (req.method === "POST") {
    try {
      // find a record and NORMALIZE
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id="3"`,
        })
        .firstPage();

      if (findCoffeeStoreRecords.length !== 0) {
        console.log("found store");
        const records = findCoffeeStoreRecords.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json(records);
      } else {
        // create a record
        const createRecords = await table.create([
          {
            fields: {
              id: "1",
              name: "My favourite coffee store",
              address: "Conflans",
              neighbourhood: "some y place",
              voting: 200,
              imgUrl: "http://myimage.com",
            },
          },
        ]);

        const records = createRecords.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json(records);
      }
    } catch (error) {
      console.error("Error finding store", error);
      res.status(500);
      res.json({ message: "Error finding store", error });
    }
  }
};

export default createCoffeStore;
