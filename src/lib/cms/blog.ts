import { insights, type InsightArticle } from "@/content/insights";

export interface BlogContent {
  articles: InsightArticle[];
}

export const defaultBlogContent: BlogContent = {
  articles: insights.en.map((article) => ({ ...article })),
};

export function mergeBlogContent(value: unknown): BlogContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultBlogContent;
  const articles = (value as { articles?: unknown }).articles;
  if (!Array.isArray(articles)) return defaultBlogContent;
  const valid = articles.filter((item): item is InsightArticle => {
    if (!item || typeof item !== "object") return false;
    const row = item as Record<string, unknown>;
    return ["slug", "category", "title", "summary", "body", "image", "imageAlt"].every(
      (key) => typeof row[key] === "string",
    );
  });
  return { articles: valid };
}
