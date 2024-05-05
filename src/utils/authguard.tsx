import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'src/store';
import { GuardProps } from 'src/types';
import { paths } from 'src/routes/paths';

const AuthGuard = ({ children }: GuardProps) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  console.log('🚀 ~ AuthGuard ~ isLoggedIn, user:', isLoggedIn, user);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(paths.auth.login, { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return children;
};

export default AuthGuard;
