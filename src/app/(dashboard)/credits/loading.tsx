import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CreditsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Solde */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-28" />
        </CardContent>
      </Card>

      {/* Packs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="text-center">
            <CardHeader className="pb-2">
              <Skeleton className="mx-auto h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="mx-auto h-9 w-12" />
              <Skeleton className="mx-auto h-4 w-16" />
              <Skeleton className="mx-auto h-8 w-20" />
              <Skeleton className="mx-auto h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
