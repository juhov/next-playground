import { componentStash } from "@/app/page";
import { Component, Item } from "@/pages/api/page";
import { Suspense } from "react";
import ItemsLoader from "./ItemsLoader";

type RendererProps =
  | {
      item: Item;
      componentId?: never;
    }
  | {
      item?: never;
      componentId: Component["id"];
    };

export async function Renderer({ item, componentId }: RendererProps) {
  let component: Component | undefined;

  /**
   * If we are rendering a component, then we need to find it from the stash.
   */
  if (componentId) {
    const stashedComponent = componentStash.find(
      (component) => component.id === componentId
    );
    if (stashedComponent) {
      component = stashedComponent;
    }
  }

  /**
   * Containers
   */
  if (component) {
    let items = component.items;
    const query = component.query;
    const hasMissingChildren = items.length === 0 && query;

    if (hasMissingChildren) {
      componentStash.push(component);
    }

    const Children = () => {
      if (hasMissingChildren) {
        // @ts-expect-error Server Component
        return <ItemsLoader query={query} componentId={component.id} />;
      }

      const returnedChildren = [] as React.ReactElement[];

      for (const item of items) {
        if ("items" in item) {
          componentStash.push(item);

          returnedChildren.push(
            // @ts-expect-error Server Component
            <Renderer key={item.id} componentId={item.id} />
          );
        } else {
          returnedChildren.push(
            // @ts-expect-error Server Component
            <Renderer key={item.id} item={item} />
          );
        }
      }

      return returnedChildren;
    };

    switch (component.type) {
      case "container-a":
        return (
          <ContainerA>
            <Suspense fallback={<Skeletons type={component.defaultItemType} />}>
              {/* @ts-expect-error Server Component */}
              <Children />
            </Suspense>
          </ContainerA>
        );
      case "container-b":
        return (
          <ContainerB>
            <Suspense fallback={<Skeletons type={component.defaultItemType} />}>
              {/* @ts-expect-error Server Component */}
              <Children />
            </Suspense>
          </ContainerB>
        );
      default:
        return <div>Unknown component</div>;
    }
  } else if (item) {
    /**
     * Items
     */
    switch (item.type) {
      case "red":
        return <ItemRed item={item} />;
      case "blue":
        return <ItemBlue item={item} />;
      default:
        return <div>Unknown item</div>;
    }
  } else {
    return <div>Unknown</div>;
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

function ItemBlueSkeleton() {
  return (
    <div className="item blue">
      <div>...</div>
    </div>
  );
}

function ItemRedSkeleton() {
  return (
    <div className="item red">
      <div>...</div>
    </div>
  );
}

function Skeletons({ type }: { type: Component["defaultItemType"] }) {
  switch (type) {
    case "red":
      return (
        <>
          <ItemRedSkeleton />
          <ItemRedSkeleton />
        </>
      );
    case "blue":
      return (
        <>
          <ItemBlueSkeleton />
          <ItemBlueSkeleton />
        </>
      );
    default:
      return <div>Unknown item</div>;
  }
}
