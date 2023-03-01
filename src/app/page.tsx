import { Component, Item, Page } from "@/pages/api/page";
import { Suspense } from "react";

export default async function Home() {
  const page = await fetch("http://localhost:3000/api/page", {
    cache: "no-cache",
  });
  const pageData = (await page.json()) as Page;

  return (
    <div>
      {pageData.components.map((component) => (
        <Suspense key={component.id} fallback="Loading...">
          {/* @ts-expect-error Server Component */}
          <Renderer componentOrItem={component} />
        </Suspense>
      ))}
    </div>
  );
}

async function Renderer({
  componentOrItem,
}: {
  componentOrItem: Component | Item;
}) {
  /**
   * Containers
   */
  if ("items" in componentOrItem) {
    const component = componentOrItem;

    let items = component.items;
    const query = component.query;

    if (items.length === 0 && query) {
      const response = await fetch(`http://localhost:3000/api/component`, {
        cache: "no-cache",
      });
      const componentData = (await response.json()) as Component;
      items = componentData.items;
    }

    const children = items.map((item) => (
      // @ts-expect-error Server Component
      <Renderer key={item.id} componentOrItem={item} />
    ));

    switch (component.type) {
      case "container-a":
        return <ContainerA>{children}</ContainerA>;
      case "container-b":
        return <ContainerB>{children}</ContainerB>;
      default:
        return <div>Unknown component</div>;
    }
  } else {
    /**
     * Items
     */
    const item = componentOrItem;

    switch (item.type) {
      case "red":
        return <ItemRed item={item} />;
      case "blue":
        return <ItemBlue item={item} />;
      default:
        return <div>Unknown item</div>;
    }
  }
}

function ContainerA({ children }: { children: React.ReactNode }) {
  return (
    <fieldset>
      <legend>Container A</legend>
      <div>{children}</div>
    </fieldset>
  );
}

function ContainerB({ children }: { children: React.ReactNode }) {
  return (
    <fieldset>
      <legend>Container B</legend>
      <div>{children}</div>
    </fieldset>
  );
}

function ItemBlue({ item }: { item: Item }) {
  return (
    <div className="item blue">
      <div>{item.title}</div>
    </div>
  );
}

function ItemRed({ item }: { item: Item }) {
  return (
    <div className="item red">
      <div>{item.title}</div>
    </div>
  );
}
