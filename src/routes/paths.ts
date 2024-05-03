// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  USERS: '/users',
  AGENTS: '/agents',
  RECORD: '/record',
  BALANCE: '/balance',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
  },
  users: { root: ROOTS.USERS, edit: (id: number) => `${ROOTS.USERS}/${id}/edit`, },
  agents: { root: ROOTS.AGENTS },
  record: { root: ROOTS.RECORD },
  balance: { root: ROOTS.BALANCE },
};
