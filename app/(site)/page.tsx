import type { Metadata } from "next";
import Home from "@/components/site/pages/index";
import { getPublishedHomePage } from "@/lib/cms/server";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedHomePage();
  return {
    title: content.translations.en["Connecting Rwanda's Buyers with Global Suppliers"],
    description: content.translations.en["LEAD MULTICHOICE bridges Rwanda's purchasing entities with credible international manufacturers and distributors through supplier identification, verification, introductions and local coordination."],
  };
}

export default async function Homepage() {
  const content = await getPublishedHomePage();
  return <Home initialContent={content} />;
}
