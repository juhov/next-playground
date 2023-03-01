import type { NextApiRequest, NextApiResponse } from "next";
import { Component } from "../page";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Component>
) {
  await sleep(5000);

  switch (req.query.id) {
    case "100":
      return res.status(200).json({
        items: [
          {
            id: "i5",
            title: "Item 5",
            type: "red",
          },
          {
            id: "i6",
            title: "Item 6",
            type: "red",
          },
        ],
      });
    case "200":
      return res.status(200).json({
        items: [
          {
            id: "i7",
            title: "Item 7",
            type: "blue",
          },
          {
            id: "i8",
            title: "Item 8",
            type: "blue",
          },
        ],
      });

    default:
      return res.status(404);
  }
}
