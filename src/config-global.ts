// routes
import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.REACT_APP_HOST_API;
export const ASSETS_API = process.env.REACT_APP_ASSETS_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.users.root as string; // as '/dashboard'

export const API_URL = process.env.REACT_APP_API_URL;


export const API_PATH = {
    // auth
    LOGIN: '/api/admin/login',
    USERS: '/api/admin/users',
    USER_DELETE: '/api/admin/user/delete',
    ROLES: '/api/admin/roles',
    CHARGING: '/api/admin/charging',
    RECORDS: '/api/admin/records',
    AUTH_GET_ME: '/api/admin/auth/me',
};