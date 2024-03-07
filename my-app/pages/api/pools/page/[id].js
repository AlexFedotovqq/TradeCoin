const data = [
  {
    pairAddress: "B62qq1DMusFhTJHrcQPUnxVo1xMJK6wKCcurBfNLhACmsmmrzZAyqVE",
    token0Name: "TradeC0",
    token0Address: "B62qmETvJ7c1pWa7sA933UQeR8TrnMXx9iPnKQxLX2kaqVQKSaDPtjG",
    token1Name: "TradeC1",
    token1Address: "B62qo2kpW6HBz77vB7914P5pjDYavHNkjbTTQiQVtmNJTmrrYiFAojj",
  },
  {
    pairAddress: "12",
    token0Name: "TradeC0",
    token0Address: "asd",
    token1Name: "TradeCoin",
    token1Address: "asd",
  },
];

export default async function handler(req, res) {
  const perPage = 6;

  const { id } = req.query;
  const pageNumber = Number(id);

  const arrayLength = data.length;

  let items = [];

  let upperLimit = perPage * pageNumber;
  const lowerLimit = upperLimit - perPage;

  if (arrayLength < upperLimit) {
    upperLimit = arrayLength - 1;
  }

  try {
    for (let index = lowerLimit; upperLimit >= index; index++) {
      items.push({ ...data[index] });
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
