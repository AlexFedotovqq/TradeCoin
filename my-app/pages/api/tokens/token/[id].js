import { tokens } from "@/utils/tokens";

export default async function handler(req, res) {
  const { id: id } = req.query;
  const idNumber = Number(id);

  const token = tokens[idNumber];
  try {
    res.status(200).json({
      token,
    });
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" + err });
  }
}
