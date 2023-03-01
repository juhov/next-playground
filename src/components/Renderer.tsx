import { Component, Item } from "@/pages/api/page";
import { Suspense } from "react";
import ItemsLoader from "./ItemsLoader";

export async function Renderer({
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

    const Children = () => {
      if (items.length > 0) {
        return (
          <>
            {items.map((item) => (
              // @ts-expect-error Server Component
              <Renderer key={item.id} componentOrItem={item} />
            ))}
          </>
        );
      }

      if (query) {
        // @ts-expect-error Server Component
        return <ItemsLoader query={query} />;
      }

      return <div>No items</div>;
    };

    switch (component.type) {
      case "container-a":
        return (
          <ContainerA>
            <Suspense
              fallback={`Loading... (Container A, defaultItemType: ${component.defaultItemType})`}
            >
              <Children />
            </Suspense>
          </ContainerA>
        );
      case "container-b":
        return (
          <ContainerB>
            <Suspense
              fallback={`Loading... (Container B, defaultItemType: ${component.defaultItemType})`}
            >
              <Children />
            </Suspense>
          </ContainerB>
        );
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
