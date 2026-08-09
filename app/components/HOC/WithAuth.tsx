// @ts-nocheck
import { useRouter } from "next/navigation";
import CustomLoader from "../feedback/CustomLoader";
import { useAuth } from "@/app/hooks/useAuth";
import { useEffect } from "react";

export function withAuth<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
) {
  return function AuthWrapper(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/sign-in");
      }
    }, [isLoading, isAuthenticated]);

    if (isLoading || !isAuthenticated) return <CustomLoader />;

    return <Component {...props} />;
  };
}
