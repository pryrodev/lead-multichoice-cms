import type { Metadata } from "next";
import Home from "@/components/site/pages/index";
import { getPublishedHomePage } from "@/lib/cms/server";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublishedHomePage();
  return {
    title: content.translations.en["Connecting International Suppliers with Purchasing Entities across Rwanda and East Africa"],
    description: content.translations.en["Lead Multichoice connects international manufacturers, authorized distributors and suppliers with purchasing entities in Rwanda and the wider East African region through trade facilitation, procurement coordination, logistics and delivery support."],
  };
}

export default async function Homepage() {
  const content = await getPublishedHomePage();
  return <Home initialContent={content} />;
}
