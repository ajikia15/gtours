"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MigrationResult {
  success: boolean;
  message: string;
  results?: {
    total: number;
    migrated: number;
    skipped: number;
    errors: number;
    details: string[];
  };
  error?: string;
}

export default function MigrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);

  const handleMigration = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/migrate-tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to run migration",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tour Data Migration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              This will migrate all tours from the old field structure to the
              new array structure:
            </p>
          </div>

          <Button
            onClick={handleMigration}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Running Migration..." : "Run Migration"}
          </Button>

          {result?.results?.details && result.results.details.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Migration Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-60 overflow-y-auto">
                  <ul className="text-sm space-y-1">
                    {result.results.details.map((detail, index) => (
                      <li key={index} className="font-mono text-xs">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
