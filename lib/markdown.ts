import { marked } from "marked";

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split(/\r?\n/);
  const items: TocItem[] = [];

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    const h3 = line.match(/^###\s+(.+)/);

    if (h2) {
      items.push({ id: slugify(h2[1]), text: h2[1].trim(), level: 2 });
    } else if (h3) {
      items.push({ id: slugify(h3[1]), text: h3[1].trim(), level: 3 });
    }
  }

  return items;
}

function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export async function renderMarkdown(markdown: string) {
  const renderer = new marked.Renderer();

  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((t) => ("text" in t ? t.text : "")).join("");
    const id = slugify(text);
    const level = Math.min(Math.max(depth, 1), 6);
    return `<h${level} id="${id}">${text}</h${level}>`;
  };

  marked.setOptions({ gfm: true, breaks: true, renderer });

  const html = await marked.parse(markdown || "");
  return sanitizeHtml(typeof html === "string" ? html : String(html));
}
