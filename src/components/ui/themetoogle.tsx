import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* storage unavailable */
  }
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
      title={isDark ? "Qorong'i rejim" : "Yorug' rejim"}
      onClick={toggle}
      className={`relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full border border-glass-border shadow-inner transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        isDark ? "bg-brand" : "bg-muted-foreground/30"
      } ${className}`}
    >
      <span
        className={`grid size-[22px] place-items-center rounded-full bg-white text-[oklch(0.3_0.05_275)] shadow transition-transform duration-200 ${
          isDark ? "translate-x-[27px]" : "translate-x-[3px]"
        }`}
      >
        {isDark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
      </span>
    </button>
  );
}
