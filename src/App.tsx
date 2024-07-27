// i18n
import 'src/locales/i18n';

// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

import 'src/assets/css/main.css';

// ----------------------------------------------------------------------

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
import LanguageSwitcher from './components/language-switcher/language-switcher';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

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
              <LanguageSwitcher/>
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
