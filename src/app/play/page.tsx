import { redirect } from "next/navigation";

/**
 * /play now redirects to / since the entire experience lives on one page.
 * The legacy Pokemon-style game is preserved at /play/legacy.
 */
export default function PlayPage() {
  redirect("/");
}
