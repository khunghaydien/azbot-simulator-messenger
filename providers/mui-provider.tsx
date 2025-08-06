'use client'
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React, { useMemo, useEffect, useState } from "react";

function getCssHslVar(variable: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `hsl(${value})` : fallback;
}

export const ThemeMuiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeVersion, setThemeVersion] = useState(0);

  useEffect(() => {
    const handleThemeChange = () => {
      setThemeVersion(prev => prev + 1);
    };

    // Listen for theme changes
    window.addEventListener("theme-change", handleThemeChange);
    
    // Also listen for class changes on document.documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: getCssHslVar("--primary", "hsl(24.6 95% 53.1%)"),
        contrastText: getCssHslVar("--primary-foreground", "hsl(60 9.1% 97.8%)"),
      },
      secondary: {
        main: getCssHslVar("--secondary", "hsl(60 4.8% 95.9%)"),
        contrastText: getCssHslVar("--secondary-foreground", "hsl(24 9.8% 10%)"),
      },
      background: {
        default: getCssHslVar("--background", "hsl(0 0% 100%)"),
        paper: getCssHslVar("--card", "hsl(0 0% 100%)"),
      },
      text: {
        primary: getCssHslVar("--foreground", "hsl(20 14.3% 4.1%)"),
        secondary: getCssHslVar("--muted-foreground", "hsl(25 5.3% 44.7%)"),
      },
      divider: getCssHslVar("--border", "hsl(20 5.9% 90%)"),
    },
    components: {
      MuiMenu: {
        styleOverrides: {
          paper: {
            marginTop: '4px',
            minWidth: '120px',
            boxShadow: '0 4px 6px -1px #00000008, 0 2px 4px -1px #00000008',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: getCssHslVar("--secondary", "hsl(60 4.8% 95.9%)"),
            },
          },
        },
      },
    },
  }), [themeVersion]); // Re-create theme when themeVersion changes

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
