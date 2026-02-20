// Rate limiter in-memory simple (pas de dépendance externe)
// Adapté pour un déploiement serverless (reset au cold start, suffisant pour le MVP)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Nettoyage périodique des entrées expirées (évite les fuites mémoire)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 60_000);

interface RateLimitConfig {
  /** Nombre maximum de requêtes dans la fenêtre */
  maxRequests: number;
  /** Durée de la fenêtre en secondes */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Vérifie si une requête est autorisée pour la clé donnée.
 * Retourne le résultat avec le nombre de requêtes restantes.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // Fenêtre expirée ou première requête
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowSeconds * 1000;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  // Fenêtre active
  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

// Alias compatible avec le pattern error-handler (success au lieu de allowed)
export function rateLimit(
  key: string,
  options: { maxRequests: number; windowSeconds: number }
): { success: boolean; remaining: number; resetAt: number } {
  const result = checkRateLimit(key, options);
  return { success: result.allowed, remaining: result.remaining, resetAt: result.resetAt };
}

// Extraire l'IP depuis les headers (Next.js / Vercel)
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
