import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function EditorPage() {
  redirect("/personal-editor-source/index.html");
}
