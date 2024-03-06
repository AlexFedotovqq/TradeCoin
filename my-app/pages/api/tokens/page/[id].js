import { tokens } from "@/utils/tokens";

export default async function handler(req, res) {
  const perPage = 6;

  const { id } = req.query;
  const pageNumber = Number(id);

  const arrayLength = tokens.length;

  let items = [];

  let upperLimit = perPage * pageNumber;
  const lowerLimit = upperLimit - perPage;

  if (arrayLength < upperLimit) {
    upperLimit = arrayLength - 1;
  }

  try {
    for (let index = lowerLimit; upperLimit >= index; index++) {
      items.push({ ...tokens[index] });
    }
  } catch (err) {
    res.status(200).json({
      items: items,
      page: pageNumber,
      error: "failed to fetch data" + err,
    });
  }
  res.status(200).json({ items: items });
}
