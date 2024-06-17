import merge from 'lodash/merge';
import {
  enUS as enUSAdapter,
  ko as koKRAdapter,
  vi as viVNAdapter,
  zhCN as zhCNAdapter,
  arSA as arSAAdapter,
} from 'date-fns/locale';
// core
import {
  enUS as enUSCore,
  koKR as koKRCore,
  viVN as viVNCore,
  zhCN as zhCNCore,
  arSA as arSACore,
} from '@mui/material/locale';
// date-pickers
// import {
//   enUS as enUSDate,
//   frFR as frFRDate,
//   viVN as viVNDate,
//   zhCN as zhCNDate,
// } from '@mui/x-date-pickers/locales';
// data-grid
// import {
//   enUS as enUSDataGrid,
//   frFR as frFRDataGrid,
//   viVN as viVNDataGrid,
//   zhCN as zhCNDataGrid,
//   arSD as arSDDataGrid,
// } from '@mui/x-data-grid';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
  },
  // {
  //   label: 'Korean',
  //   value: 'kr',
  //   systemValue: merge(koKRCore),
  //   adapterLocale: koKRAdapter,
  //   icon: 'flagpack:ko',
  // },
  // {
  //   label: 'Vietnamese',
  //   value: 'vi',
  //   systemValue: merge(viVNCore),
  //   adapterLocale: viVNAdapter,
  //   icon: 'flagpack:vn',
  // },
  // {
  //   label: 'Chinese',
  //   value: 'cn',
  //   systemValue: merge(zhCNCore),
  //   adapterLocale: zhCNAdapter,
  //   icon: 'flagpack:cn',
  // },
  // {
  //   label: 'Arabic',
  //   value: 'ar',
  //   systemValue: merge(arSACore),
  //   adapterLocale: arSAAdapter,
  //   icon: 'flagpack:sa',
  // },
];

export const defaultLang = allLangs[0]; // English

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
