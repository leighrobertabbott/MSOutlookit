import React, { createContext, useState, useContext, useEffect } from 'react';

// Theme Context
const ThemeContext = createContext({
    theme: 'dark',
    setTheme: () => { },
    settings: {},
    updateSettings: () => { }
});

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark');
    const [settings, setSettings] = useState({
        userName: 'Alex Johnson',
        initials: 'AJ',
        email: 'alex.johnson@contoso.com',
        domain: 'contoso.com',
        officeBackground: 'No Background',
        officeTheme: 'Black',
        storeCloudSettings: true,
        optimizeAppearance: true,
        showMiniToolbar: true,
        enableLivePreview: true,
        screenTipStyle: 'Show feature descriptions in ScreenTips',
        startupOption: 'Ask me if I want to reopen previous items',
        attachmentOption: 'ask',
        neverChangeBackground: false,
        alwaysUseValues: false
    });

    // Update theme based on officeTheme setting
    useEffect(() => {
        const themeMap = {
            'Black': 'dark',
            'Dark Gray': 'dark',
            'Colorful': 'light',
            'White': 'light'
        };
        const newTheme = themeMap[settings.officeTheme] || 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, [settings.officeTheme]);

    // On mount, set initial theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    const updateSettings = (newSettings) => {
        setSettings(newSettings);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, settings, updateSettings }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;
