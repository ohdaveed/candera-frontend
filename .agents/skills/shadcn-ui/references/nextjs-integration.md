# shadcn/ui - Next.js Integration

## App Router Setup

Most shadcn/ui components require `"use client"` directive when used with App Router. Static display components (Card, Table) can work in Server Components without the directive.

```tsx
// src/components/ui/button.tsx — already includes "use client" after npx shadcn@latest add button
<<<<<<< HEAD
"use client";
import * as React from "react";
=======
"use client"
import * as React from "react"
>>>>>>> origin/master
// ... rest of component
```

## Root Layout with Toaster

```tsx
// app/layout.tsx
<<<<<<< HEAD
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
=======
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
>>>>>>> origin/master

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        {children}
        <Toaster />
      </body>
    </html>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> origin/master
}
```

## Server Components with Interactive Elements

When using interactive shadcn/ui components in Server Components, wrap them in a Client Component:

```tsx
// app/dashboard/page.tsx — Server Component
<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonClient } from "@/components/button-client";
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ButtonClient } from "@/components/button-client"
>>>>>>> origin/master

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ButtonClient>Interactive Button</ButtonClient>
        </CardContent>
      </Card>
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> origin/master
}
```

```tsx
// src/components/button-client.tsx — Client Component wrapper
<<<<<<< HEAD
"use client";
import { Button } from "@/components/ui/button";

export function ButtonClient(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} />;
=======
"use client"
import { Button } from "@/components/ui/button"

export function ButtonClient(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} />
>>>>>>> origin/master
}
```

## Metadata with shadcn/ui Pages

```tsx
// app/layout.tsx
<<<<<<< HEAD
import { Metadata } from "next";
=======
import { Metadata } from "next"
>>>>>>> origin/master

export const metadata: Metadata = {
  title: { default: "My App", template: "%s | My App" },
  description: "Built with shadcn/ui and Next.js",
<<<<<<< HEAD
};
=======
}
>>>>>>> origin/master
```

```tsx
// app/about/page.tsx
<<<<<<< HEAD
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
=======
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
>>>>>>> origin/master

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our company",
<<<<<<< HEAD
};
=======
}
>>>>>>> origin/master

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
<<<<<<< HEAD
        <CardHeader>
          <CardTitle>About Our Company</CardTitle>
        </CardHeader>
=======
        <CardHeader><CardTitle>About Our Company</CardTitle></CardHeader>
>>>>>>> origin/master
        <CardContent>
          <p>We build amazing products with modern web technologies.</p>
        </CardContent>
      </Card>
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> origin/master
}
```

## Dark Mode Setup

### With next-themes

```bash
npm install next-themes
```

```tsx
// components/theme-provider.tsx
<<<<<<< HEAD
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
=======
"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
>>>>>>> origin/master
}
```

```tsx
// app/layout.tsx
<<<<<<< HEAD
import { ThemeProvider } from "@/components/theme-provider";
=======
import { ThemeProvider } from "@/components/theme-provider"
>>>>>>> origin/master

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> origin/master
}
```

### Theme Toggle Component

```tsx
<<<<<<< HEAD
"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
=======
"use client"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button variant="ghost" size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
>>>>>>> origin/master
}
```
