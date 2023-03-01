import { Component } from "@/pages/api/page";
import { Renderer } from "./Renderer";

export default async function ItemsLoader({ query }: { query: string }) {
  const response = await fetch(query, {
    cache: "no-cache",
  });
  const componentData = (await response.json()) as Component;
  const items = componentData.items;

  return (
    <>
      {items.map((item) => (
        // @ts-expect-error Server Component
        <Renderer key={item.id} componentOrItem={item} />
      ))}
    </>
  );
}
