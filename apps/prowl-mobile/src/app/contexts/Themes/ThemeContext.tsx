import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { MyThemes } from './theme';

// Create a Context for the theme
const ThemeContext = createContext<typeof MyThemes | null>(null);

// Provider component that wraps your app and provides the theme
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => {
    return colorScheme === 'dark' ? MyThemes.dark : MyThemes.light;
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ light: MyThemes.light, dark: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme in any functional component
export const useAppTheme = () => useContext(ThemeContext);
