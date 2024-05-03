/* eslint-disable-next-line padded-blocks */
import { combineReducers } from 'redux';

import auth from './auth';
import role from './role';

const reducer = combineReducers({
  auth,
  role,
});

export default reducer;
