import type { NextApiRequest, NextApiResponse } from "next";
import { Component } from "../page";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Component>
) {
  await sleep(3000);

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
    case "300":
      return res.status(200).json({
        items: [
          {
            id: "200",
            type: "container-b",
            defaultItemType: "blue",
            query: "http://localhost:3000/api/component/3001",
            items: [],
          },
        ],
      });
    case "3001":
      return res.status(200).json({
        items: [
          {
            id: "200",
            type: "container-a",
            defaultItemType: "blue",
            query: "http://localhost:3000/api/component/200",
            items: [],
          },
        ],
      });

    default:
      return res.status(404);
  }
}
