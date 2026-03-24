import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FichFlow — Créez vos fiches produit en 30 secondes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#00d296",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "#0d1117",
              fontWeight: "bold",
            }}
          >
            F
          </div>
          <span style={{ fontSize: "36px", fontWeight: "bold", color: "#fff" }}>
            FichFlow
          </span>
        </div>

        {/* Titre */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          Vos photos. Nos mots.
        </div>
        <div
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "#00d296",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Des fiches produit qui vendent.
        </div>

        {/* Sous-titre */}
        <div
          style={{
            fontSize: "22px",
            color: "#8b949e",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          Upload photo → IA analyse → PDF prêt en 30 secondes
        </div>

        {/* Badge */}
        <div
          style={{
            marginTop: "32px",
            padding: "8px 20px",
            borderRadius: "20px",
            background: "rgba(0, 210, 150, 0.15)",
            color: "#00d296",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          3 crédits offerts — Sans carte bancaire
        </div>
      </div>
    ),
    { ...size }
  );
}
