// i18n
import 'src/locales/i18n';

// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

import 'src/assets/css/main.css';

// ----------------------------------------------------------------------
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
// routes
import Router from 'src/routes/sections';
// theme
import ThemeProvider from 'src/theme';
// hooks
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
// components
import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { LocalizationProvider } from 'src/locales';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
import { ApiProvider } from './contexts/ApiContext';
import { SocketProvider } from './contexts/SocketContext';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const { i18n } = useTranslation();
  useEffect(() => {
    // Change the language to Korean on the first render
    i18n.changeLanguage('ko');
  }, [i18n]); // Empty dependency array ensures this runs only once
  return (
    <LocalizationProvider>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'dark', // 'light' | 'dark'
          themeDirection: 'ltr', //  'rtl' | 'ltr'
          themeContrast: 'default', // 'default' | 'bold'
          themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
      >
        <ThemeProvider>
          <MotionLazy>
            <SnackbarProvider>
              <SettingsDrawer />
              <ProgressBar />
              <SocketProvider>
                <ApiProvider>
                  <Router />
                </ApiProvider>
              </SocketProvider>
            </SnackbarProvider>
          </MotionLazy>
        </ThemeProvider>
      </SettingsProvider>
    </LocalizationProvider>
  );
}
