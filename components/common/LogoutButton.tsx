"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "secondary"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function LogoutButton({
  variant = "outline",
  size = "default",
  showIcon = true,
  showLabel = true,
  className,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: true, redirectTo: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <ImSpinner2 className="h-4 w-4 animate-spin" />
      ) : (
        showIcon && <HiArrowRightOnRectangle className="h-4 w-4" />
      )}
      {showLabel && (
        <span className={showIcon ? "ml-2" : ""}>
          {isLoading ? "Logging out..." : "Logout"}
        </span>
      )}
    </Button>
  );
}
