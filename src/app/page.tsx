import { Page } from "@/pages/api/page";
import { Suspense } from "react";
import { Renderer } from "../components/Renderer";

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
