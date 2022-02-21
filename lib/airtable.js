// AIRTABLE STUFF
var Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("coffee-stores");
// End AIRTABLE STUFF

const getMinifiedRecord = (record) => {
  return {
    recordId: record.id, // Id of the row in Airtable
    ...record.fields,
  };
};

const getMinifiedRecords = (records) => {
  // console.log(records);
  return records.map((record) => getMinifiedRecord(record));
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordByFilter };
