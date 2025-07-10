import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

import { Button } from "@/components/ui/button"; // bouton shadcn/heroui

export default function DarkMode() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      title="Basculer mode sombre"
    >
      {currentTheme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-900" />
      )}
    </Button>
  );
}
