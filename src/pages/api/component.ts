import type { NextApiRequest, NextApiResponse } from "next";
import { Component } from "./page";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Component>
) {
  await sleep(5000);

  res.status(200).json({
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
}
