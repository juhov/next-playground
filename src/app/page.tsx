import { Component, Page } from "@/pages/api/page";
import { Renderer } from "../components/Renderer";

/**
 * Set up a stash to store components so that they can be used without passing them
 * as props.
 *
 * 🛑🛑🛑 This might lead to memory leaks and shared state between requests. 🛑🛑🛑
 */
export const componentStash: Component[] = [];

export default async function CapiPage() {
  const page = await fetch("http://localhost:3000/api/page", {
    cache: "no-cache",
  });
  const pageData = (await page.json()) as Page;

  let pageComponents = [] as React.ReactElement[];

  for (const component of pageData.components) {
    // Stash the component for later
    componentStash.push(component);

    pageComponents.push(
      // @ts-expect-error Server Component
      <Renderer key={component.id} componentId={component.id} />
    );
  }

  return pageComponents;
}
