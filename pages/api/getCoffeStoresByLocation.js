import { fetchCoffeeStores } from "../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
  // configure latlong, limit
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong, limit);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.error("Error fetching", error);
    res.status(500);
    res.json({ message: "Smth went wrong", error });
  }

  // return
};

export default getCoffeeStoresByLocation;
