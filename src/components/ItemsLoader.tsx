import { componentStash } from "@/app/page";
import { Component } from "@/pages/api/page";
import { Renderer } from "./Renderer";

type ItemsLoaderProps = {
  query: string;
  componentId: Component["id"];
};

export default async function ItemsLoader({
  query,
  componentId,
}: ItemsLoaderProps) {
  const response = await fetch(query, {
    cache: "no-cache",
  });
  const componentData = (await response.json()) as Component;
  const items = componentData.items;

  // Update the component in the stash
  const stashedComponent = componentStash.find(
    (component) => component.id === componentId
  );
  if (stashedComponent) {
    stashedComponent.items = items;
  }

  const renderedItems = [] as React.ReactElement[];

  /**
   * Check if the items are components or items.
   */
  for (const item of items) {
    /**
     * 1. If the item has items, then it is a component.
     */
    if ("items" in item) {
      renderedItems.push(
        // @ts-expect-error Server Component
        <Renderer key={item.id} componentId={item.id} />
      );
      return;
    }
    /**
     * 2. Else, it is an item.
     */
    renderedItems.push(
      // @ts-expect-error Server Component
      <Renderer key={item.id} item={item} />
    );
  }

  return renderedItems;
}
