export default function ilovedogs(req, res) {
  console.log({ req });
  const chosenBreed = req.query;

  res.status(200).json({ breed: `I love ${chosenBreed}` });
}
