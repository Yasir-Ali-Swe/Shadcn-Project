"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const { isAuthenticated, isProfileComplete, user, role } = useSelector(
    (state) => state.auth,
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth state is not yet loaded (initial boot), we might want to wait?
    // However, AuthBootstrap runs parallel. If we are in Dashboard, Middleware handles cookie check.
    // Client side adds granular check.

    // NOTE: If AuthBootstrap is still loading, isAuthenticated might be false briefly.
    // Ideally we should have an 'isLoading' flag in redux.
    // For now, assuming if cookie exists middleware passed, but redux might be empty until fetched.
    // This could cause a flash of redirect.
    // We can check if 'user' is null but cookie exists? No access to cookie easily here without hydration mismatch.

    // User requirement: "Redirect to /dashboard/{role}/profile if profile incomplete"

    if (isAuthenticated) {
      if (!isProfileComplete) {
        const normalizedRole = role.replace("_", "-");
        const profilePath = `/dashboard/${normalizedRole}/complete-profile`;
        // Avoid infinite loop if already on profile page
        if (pathname !== profilePath) {
          router.push(profilePath);
        }
      }
    }
  }, [isAuthenticated, isProfileComplete, role, router, pathname]);

  // If strict protection is needed and we want to hide content:
  // if (!isAuthenticated) return null; // or loading spinner
  // But Middleware handles the main protection.

  return <>{children}</>;
}
