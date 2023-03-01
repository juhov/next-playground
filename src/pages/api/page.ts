import type { NextApiRequest, NextApiResponse } from "next";

export type Item = {
  id: string;
  title: string;
  type: "red" | "blue";
};

export type Component = {
  id?: string;
  type?: "container-a" | "container-b";
  defaultItemType?: string;
  query?: string;
  items: (Item | Component)[];
};

export type Page = {
  id: string;
  components: Component[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Page>
) {
  res.status(200).json({
    id: "page",
    components: [
      {
        id: "basic",
        type: "container-a",
        defaultItemType: "red",
        items: [
          {
            id: "i1",
            title: "Item 1",
            type: "red",
          },
          {
            id: "i2",
            title: "Item 2",
            type: "red",
          },
        ],
      },
      {
        id: "nested-parent",
        type: "container-b",
        defaultItemType: "blue",
        items: [
          {
            id: "nested-child",
            type: "container-a",
            defaultItemType: "blue",
            items: [
              {
                id: "i3",
                title: "Item 3",
                type: "blue",
              },
              {
                id: "i4",
                title: "Item 4",
                type: "blue",
              },
            ],
          },
        ],
      },
      {
        id: "no-preloaded-items",
        type: "container-b",
        defaultItemType: "red",
        query: "http://localhost:3000/api/component",
        items: [],
      },
    ],
  });
}