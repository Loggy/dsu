/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // Design System Colors from DESIGN_CONCEPT.md
      colors: {
        // Primary Palette
        "deep-ocean": {
          DEFAULT: "#0A2540",
          50: "#E6EBF0",
          100: "#CCD7E1",
          200: "#99AFC3",
          300: "#6687A5",
          400: "#335F87",
          500: "#0A2540", // Main Deep Ocean Blue
          600: "#081E33",
          700: "#061626",
          800: "#040F1A",
          900: "#02070D",
        },
        "electric-teal": {
          DEFAULT: "#00D9C0",
          50: "#E6FFFB",
          100: "#CCFFF7",
          200: "#99FFEF",
          300: "#66FFE7",
          400: "#33FFDF",
          500: "#00D9C0", // Main Electric Teal
          600: "#00AE9A",
          700: "#008273",
          800: "#00574D",
          900: "#002B26",
        },
        "sage-green": {
          DEFAULT: "#5FB97C",
          50: "#F0F9F3",
          100: "#E1F3E7",
          200: "#C3E7CF",
          300: "#A5DBB7",
          400: "#87CF9F",
          500: "#5FB97C", // Main Sage Green
          600: "#4C9463",
          700: "#396F4A",
          800: "#264A32",
          900: "#132519",
        },
        // Secondary Palette
        "cloud-white": {
          DEFAULT: "#F8FAFB",
          50: "#FFFFFF",
          100: "#F8FAFB", // Main Cloud White
        },
        "slate-gray": {
          DEFAULT: "#64748B",
          50: "#F1F5F9",
          100: "#E2E8F0",
          200: "#CBD5E1",
          300: "#94A3B8",
          400: "#64748B", // Main Slate Gray
          500: "#475569",
          600: "#334155",
          700: "#1E293B",
          800: "#0F172A",
          900: "#020617",
        },
        midnight: {
          DEFAULT: "#1E293B",
          50: "#E2E8F0",
          100: "#CBD5E1",
          200: "#94A3B8",
          300: "#64748B",
          400: "#475569",
          500: "#334155",
          600: "#1E293B", // Main Midnight
          700: "#0F172A",
          800: "#020617",
          900: "#000000",
        },
        // Functional Colors
        "moss-green": "#10B981",
        amber: "#F59E0B",
        coral: "#EF4444",
        // shadcn/ui CSS variable colors (defined in base.css)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Legacy semantic mappings (kept for backwards compatibility)
        primary: {
          50: "#E6EBF0",
          100: "#CCD7E1",
          200: "#99AFC3",
          300: "#6687A5",
          400: "#335F87",
          500: "#0A2540", // Deep Ocean Blue
          600: "#081E33",
          700: "#061626",
          800: "#040F1A",
          900: "#02070D",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          50: "#F1F5F9",
          100: "#E2E8F0",
          200: "#CBD5E1",
          300: "#94A3B8",
          400: "#64748B", // Slate Gray
          500: "#475569",
          600: "#334155",
          700: "#1E293B",
          800: "#0F172A",
          900: "#020617",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          50: "#E6FFFB",
          100: "#CCFFF7",
          200: "#99FFEF",
          300: "#66FFE7",
          400: "#33FFDF",
          500: "#00D9C0", // Electric Teal
          600: "#00AE9A",
          700: "#008273",
          800: "#00574D",
          900: "#002B26",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          50: "#F0F9F3",
          100: "#E1F3E7",
          200: "#C3E7CF",
          300: "#A5DBB7",
          400: "#87CF9F",
          500: "#5FB97C", // Sage Green
          600: "#4C9463",
          700: "#396F4A",
          800: "#264A32",
          900: "#132519",
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B", // Amber
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444", // Coral
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      // Typography from DESIGN_CONCEPT.md
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "Monaco", "monospace"],
      },
      fontSize: {
        // Standard scale
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.025em" }], // 12px - Caption
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px - Body Small
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px - Body
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px - Body Large
        xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px - H4
        "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px - H3
        "3xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }], // 36px - H2
        "4xl": ["3rem", { lineHeight: "3.5rem", letterSpacing: "-0.02em" }], // 48px - H1
        "5xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.02em" }], // 72px - Hero Display
        // Mobile adjustments
        "hero-mobile": [
          "2.25rem",
          { lineHeight: "2.5rem", letterSpacing: "-0.02em" },
        ], // 36px mobile
        "hero-desktop": [
          "4.5rem",
          { lineHeight: "1", letterSpacing: "-0.02em" },
        ], // 72px desktop
      },
      // Spacing Scale from DESIGN_CONCEPT.md
      spacing: {
        0: "0px",
        1: "4px", // Tight
        2: "8px", // Compact
        3: "12px",
        4: "16px", // Base
        5: "20px",
        6: "24px", // Standard
        8: "32px", // Comfortable
        10: "40px",
        12: "48px", // Generous
        14: "56px",
        16: "64px", // Spacious
        20: "80px",
        24: "96px", // Extra
        28: "112px",
        32: "128px",
      },
      // Border Radius from DESIGN_CONCEPT.md
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px", // Standard card/button radius
        md: "12px", // Card radius
        lg: "16px", // Large card radius
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },
      // Box Shadows from DESIGN_CONCEPT.md
      boxShadow: {
        // Card shadows
        card: "0 4px 6px rgba(0, 0, 0, 0.07)",
        "card-hover": "0 8px 12px rgba(0, 0, 0, 0.10)",
        // Soft neumorphism
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium:
          "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        hard: "0 10px 40px -10px rgba(0, 0, 0, 0.15)",
        // Glow effects
        "glow-teal": "0 0 20px rgba(0, 217, 192, 0.15)",
        "glow-teal-lg": "0 0 30px rgba(0, 217, 192, 0.25)",
        "glow-blue": "0 0 20px rgba(10, 37, 64, 0.15)",
      },
      // Max widths for content
      maxWidth: {
        content: "1200px", // Max content width from DESIGN_CONCEPT.md
      },
      // Backdrop blur for frosted glass effect
      backdropBlur: {
        glass: "12px",
      },
      // Animations from DESIGN_CONCEPT.md
      animation: {
        // Page load animations
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        // Micro-interactions
        lift: "lift 0.2s ease-out",
        "lift-card": "liftCard 0.3s ease-out",
        glow: "glow 0.3s ease-out",
        "count-up": "countUp 1s ease-out",
        sparkline: "sparkline 1.5s ease-out",
        // Utility
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        lift: {
          "0%": { transform: "translateY(0) scale(1)" },
          "100%": { transform: "translateY(-2px) scale(1.02)" },
        },
        liftCard: {
          "0%": {
            transform: "translateY(0)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
          },
          "100%": {
            transform: "translateY(-4px)",
            boxShadow:
              "0 8px 12px rgba(0, 0, 0, 0.10), 0 0 20px rgba(0, 217, 192, 0.15)",
          },
        },
        glow: {
          "0%": { boxShadow: "0 0 0px rgba(0, 217, 192, 0)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 217, 192, 0.25)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sparkline: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      // Transition durations
      transitionDuration: {
        200: "200ms",
        300: "300ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
