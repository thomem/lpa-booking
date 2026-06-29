import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Protège /admin et toutes ses sous-routes SAUF /admin/login
  // (sinon : redirection vers login -> login protégée -> boucle infinie).
  matcher: ["/admin", "/admin/((?!login).*)"],
};
