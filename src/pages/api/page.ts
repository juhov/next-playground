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
  notUsedData?: string;
};

export type Page = {
  id: string;
  components: Component[];
};

export const loremIpsum = () =>
  Array.from(
    { length: 5000 },
    (_, i) => `Lorem ipsum dolor sit amet ${i}.`
  ).join(" ");

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
          {
            id: "extra-1",
            title: "Extra 1",
            type: "red",
          },
          {
            id: "extra-2",
            title: "Extra 2",
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
          {
            id: "200",
            type: "container-a",
            defaultItemType: "blue",
            query: "http://localhost:3000/api/component/200",
            items: [],
          },
        ],
      },
      {
        id: "100",
        type: "container-b",
        defaultItemType: "red",
        query: "http://localhost:3000/api/component/100",
        items: [],
      },
      {
        id: "100",
        type: "container-b",
        defaultItemType: "red",
        query: "http://localhost:3000/api/component/300",
        items: [],
        notUsedData: loremIpsum(),
      },
    ],
  });
}
