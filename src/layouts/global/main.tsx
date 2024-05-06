// @mui
import Box, { BoxProps } from '@mui/material/Box';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
//
import { HEADER, NAV } from '../config-layout';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({ children, sx, ...other }: BoxProps) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  if (isNavHorizontal) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: 3,
          pb: 10,
          ...(lgUp && {
            pt: 5,
            pb: 15,
          }),
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        // ...(lgUp && {
        //   px: 2,
        //   py: `${HEADER.H_DESKTOP + SPACING}px`,
        //   width: `calc(100% - ${NAV.W_VERTICAL}px)`,
        //   ...(isNavMini && {
        //     width: `calc(100% - ${NAV.W_MINI}px)`,
        //   }),
        // }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
