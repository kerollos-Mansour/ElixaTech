import Link from "next/link";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function NotFound() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "1rem"
    }}>
      <h1 style={{ fontSize: "6rem", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Page Not Found</h2>
      <p style={{ color: "var(--muted)", marginBottom: "3rem", maxWidth: "500px" }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" style={{
        padding: "1rem 2rem",
        background: "var(--primary)",
        color: "white",
        borderRadius: "var(--radius)",
        fontWeight: 600
      }}>
        Go back home
      </Link>
    </div>
  );
}
