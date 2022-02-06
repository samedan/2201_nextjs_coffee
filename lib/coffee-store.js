// UNSPLASH
import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: process.env.FOURSQUARE_API_KEY,
  },
};

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}`;
};

// PHOTOS
const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    // page: 1,
    perPage: 10,
    // color: "green",
    // orientation: "portrait",
  });

  const unsplashResultsUsers = photos.response.results;
  return unsplashResultsUsers.map((user) => user.urls.small);
};

// COFFEE STORES
export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(
    getUrlForCoffeeStores("43,-79", "coffee stores", 6),
    options
  );

  const intData = await response.json();
  const data = intData?.results;

  // console.log(data.results);

  return data.map((venue, idx) => {
    console.log(venue);
    return {
      ...venue,
      // fsq_id: venue.fsq_id,
      // address: venue.location.address,
      // neighbourhood: venue.location.neighborhood,
      imgUrl: photos[idx],
    };
  });
};
