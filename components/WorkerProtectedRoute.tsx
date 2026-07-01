"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkerAuth } from "@/context/WorkerAuthContext";
import { PageLoader } from "./Loader";

interface WorkerProtectedRouteProps {
  children: React.ReactNode;
}

export default function WorkerProtectedRoute({ children }: WorkerProtectedRouteProps) {
  const { isWorkerAuthenticated, isLoading } = useWorkerAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isWorkerAuthenticated) {
      router.replace("/worker/login");
    }
  }, [isWorkerAuthenticated, isLoading, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isWorkerAuthenticated) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
