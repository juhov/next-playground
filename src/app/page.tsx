import { Page } from "@/pages/api/page";
import { Renderer } from "../components/Renderer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const page = await fetch("http://localhost:3000/api/page", {
    cache: "no-cache",
  });
  const pageData = (await page.json()) as Page;

  return (
    <div>
      {pageData.components.map((component) => (
        // @ts-expect-error Server Component
        <Renderer key={component.id} componentOrItem={component} />
      ))}
    </div>
  );
}
