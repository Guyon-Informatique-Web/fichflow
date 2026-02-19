import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductView } from "./product-view";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true },
  });
  return {
    title: product?.name ?? "Produit introuvable",
  };
}

export default async function ProduitPage({ params }: Props) {
  const { id } = await params;
  const user = await getAuthUser();

  const product = await prisma.product.findUnique({
    where: { id, userId: user.id },
    include: {
      exports: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!product) {
    notFound();
  }

  return <ProductView product={product} />;
}
