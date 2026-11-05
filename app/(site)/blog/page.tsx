import type { Metadata } from "next";
import BlogPage from "@/components/site/pages/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical articles on trade facilitation, sourcing, supplier readiness and supply coordination in Rwanda.",
};

export default function Page() {
  return <BlogPage />;
}
