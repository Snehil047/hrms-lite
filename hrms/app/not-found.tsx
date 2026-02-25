"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
        <FileQuestion className="h-12 w-12 text-primary" />
      </div>

      <h1 className="text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl">
        404
      </h1>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Page Not Found
      </h2>
      <p className="mt-4 max-w-md text-muted-foreground text-sm sm:text-base">
        Sorry, we couldnt find the page youre looking for. It might have been
        moved, deleted, or the URL might be incorrect.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button asChild variant="outline" size="lg" className="gap-2">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </Button>

        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
