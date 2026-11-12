// JSON-LD (schema.org) cho một bài viết: các hàm thuần trả về đối tượng, để test được. Cùng ý với src/lib/structured-data.ts của blog Tech Notes.

/** Chuỗi để đặt trong <script type="application/ld+json">. Thay "<" bằng < để nội dung không bao giờ đóng được thẻ script. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type Crumb = { name: string; url: string };

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: crumb.url })),
  };
}

export type BaiViet = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  authorName: string;
  siteName: string;
  siteUrl: string;
};

export function blogPostingLd(post: BaiViet) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "vi",
    keywords: post.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": post.url },
    url: post.url,
    author: { "@type": "Person", name: post.authorName },
    publisher: { "@type": "Organization", name: post.siteName, url: post.siteUrl },
  };
}
