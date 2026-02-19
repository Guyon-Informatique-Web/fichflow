import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1 solid #e5e5e5",
  },
  logo: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#0a0a0a",
  },
  category: {
    fontSize: 9,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  mainContent: {
    flexDirection: "row",
    gap: 20,
  },
  photoColumn: {
    width: "40%",
  },
  photo: {
    width: "100%",
    borderRadius: 4,
    marginBottom: 8,
  },
  infoColumn: {
    width: "60%",
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#0a0a0a",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    marginTop: 14,
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#333",
  },
  characteristicsTable: {
    marginTop: 6,
  },
  characteristicRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #eee",
    paddingVertical: 4,
  },
  characteristicKey: {
    width: "35%",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#555",
  },
  characteristicValue: {
    width: "65%",
    fontSize: 9,
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
    borderTop: "0.5 solid #eee",
    paddingTop: 8,
  },
});

interface ProductPdfProps {
  name: string;
  title: string;
  description: string;
  characteristics: Record<string, string>;
  category: string;
  price: number | null;
  photos: string[];
}

export function ProductPdf({
  name,
  title,
  description,
  characteristics,
  category,
  price,
  photos,
}: ProductPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.logo}>FichFlow</Text>
          <Text style={styles.category}>{category}</Text>
        </View>

        {/* Contenu principal */}
        <View style={styles.mainContent}>
          {/* Photos */}
          <View style={styles.photoColumn}>
            {photos.map((url, i) => (
              <Image key={i} src={url} style={styles.photo} />
            ))}
          </View>

          {/* Informations */}
          <View style={styles.infoColumn}>
            <Text style={styles.title}>{title}</Text>
            {price && <Text style={styles.price}>{price.toFixed(2)} €</Text>}

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{description}</Text>

            {Object.keys(characteristics).length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Caractéristiques</Text>
                <View style={styles.characteristicsTable}>
                  {Object.entries(characteristics).map(([key, value]) => (
                    <View key={key} style={styles.characteristicRow}>
                      <Text style={styles.characteristicKey}>{key}</Text>
                      <Text style={styles.characteristicValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

        {/* Pied de page */}
        <Text style={styles.footer}>
          Fiche produit générée par FichFlow — {name}
        </Text>
      </Page>
    </Document>
  );
}
