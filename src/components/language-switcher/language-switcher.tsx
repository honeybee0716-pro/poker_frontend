// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import {Button, Stack} from '@mui/material'

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <Stack direction="row" width={50}>
      <Button sx={{width: { xs: 15, sm: 30 },height: { xs: 15, sm: 30 }}} onClick={() => changeLanguage('en')}>English</Button>
      <Button sx={{width: { xs: 15, sm: 30 },height: { xs: 15, sm: 30 }}} onClick={() => changeLanguage('ko')}>Korean</Button>
    </Stack>
  );
};

export default LanguageSwitcher;
