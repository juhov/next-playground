import { Component, Item } from "@/pages/api/page";
import { Suspense } from "react";

export async function Renderer({
  componentOrItem,
}: {
  componentOrItem: Component | Item;
}) {
  /**
   * ▶️▶️▶️ Kyseessä on komponentti
   */
  if ("items" in componentOrItem) {
    const component = componentOrItem;

    let items = component.items;
    const query = component.query;

    /**
     * Komponentin sisällä olevien itemien renderöinti.
     */
    const ComponentItems = async () => {
      // Jos komponentilla on itemeitä, renderöi ne...
      if (items.length > 0) {
        return items.slice(0, 2).map((item) => (
          // @ts-expect-error Server Component
          <Renderer key={item.id} componentOrItem={item} />
        ));
      }

      // ...jos ei ole, mutta komponentilla on query, niin lataa itemit.
      if (query) {
        const response = await fetch(query, {
          cache: "no-cache",
        });
        const componentData = (await response.json()) as Component;
        const items = componentData.items;

        return items.slice(0, 2).map((item) => (
          // @ts-expect-error Server Component
          <Renderer key={item.id} componentOrItem={item} />
        ));
      }

      return <div>No items</div>;
    };

    // Yhdistä CAPIN kontaineri oikeaan UI-kirjaston komponenttiin.
    switch (component.type) {
      case "container-a":
        return (
          <ContainerA>
            <Suspense fallback={<FallbackRenderer component={component} />}>
              {/* @ts-expect-error Server Component */}
              <ComponentItems />
            </Suspense>
          </ContainerA>
        );
      case "container-b":
        return (
          <ContainerB>
            <Suspense fallback={<FallbackRenderer component={component} />}>
              {/* @ts-expect-error Server Component */}
              <ComponentItems />
            </Suspense>
          </ContainerB>
        );
      default:
        return <div>Unknown component</div>;
    }
  } else {
    /**
     * ▶️▶️▶️ Kyseessä on komponentin itemi
     */
    const item = componentOrItem;

    // Yhdistä CAPIN itemi oikeaan UI-kirjaston komponenttiin.
    switch (item.type) {
      case "red":
        const redItemProps: ItemRedProps = {
          title: item.title,
        };

        return <ItemRed {...redItemProps} />;

      case "blue":
        const blueItemProps: ItemRedProps = {
          title: item.title,
        };

        return <ItemBlue {...blueItemProps} />;
      default:
        return <div>Unknown item</div>;
    }
  }
}

type FallbackRendererProps = {
  component: Component;
};
function FallbackRenderer({ component }: FallbackRendererProps) {
  return (
    <div>
      Loading... Container B, defaultItemType: {component.defaultItemType}{" "}
      {component.notUsedData && (
        <>
          notUsedData: {component.notUsedData?.split(" ").slice(0, 2).join(" ")}
        </>
      )}
    </div>
  );
}

/**
 * ----------- UI Kirjasto ↓ -----------
 */

// Containers

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

// Items

type ItemBlueProps = {
  title: string;
};
function ItemBlue({ title }: ItemBlueProps) {
  return (
    <div className="item blue">
      <div>{title}</div>
    </div>
  );
}

type ItemRedProps = {
  title: string;
};
function ItemRed({ title }: ItemRedProps) {
  return (
    <div className="item red">
      <div>{title}</div>
    </div>
  );
}
