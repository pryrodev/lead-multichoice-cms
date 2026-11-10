import type { Metadata } from "next";
import MediaPage from "@/components/site/pages/media";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Explore the markets, people and supply journeys connected through Lead Multi-Choice's trade facilitation work in Rwanda and the region.",
};

export default function Page() {
  return <MediaPage />;
}
