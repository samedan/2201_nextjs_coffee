import {
  table,
  findRecordByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          const record = records[0];
          const calculateVoting = parseInt(record.voting) + parseInt(1);
          // console.log({ calculateVoting, id: record.id });

          // UPDATE Record
          const updateRecord = await table.update([
            {
              id: record.recordId, // The id of the row/col in Airtable
              fields: {
                voting: calculateVoting,
              },
            },
          ]);
          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            return res.json(minifiedRecords);
          }
        } else {
          res.status(400);
          res.json({ message: "Coffee store ID doens't exist", id });
        }
        res.json({ message: "PUT works", id });
      } else {
        res.status(400);
        res.json({ message: "ID is missing" });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: "Error voting the coffee Store", error });
    }
  }
};

export default favouriteCoffeeStoreById;
