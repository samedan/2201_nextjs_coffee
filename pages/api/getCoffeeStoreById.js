import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  console.log({ id });

  try {
    if (id) {
      const records = await findRecordByFilter(id);
      if (records.length !== 0) {
        res.json(records);
      } else {
        res.json({ message: `ID could not be found` });
      }
    } else {
      res.status(400);
      res.json({ message: "Id is missing" });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: "Smth went wrong", error });
  }
};

export default getCoffeeStoreById;
