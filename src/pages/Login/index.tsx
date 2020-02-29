import { Loading } from '@aurora_app/ui-library';
import Loadable from 'react-loadable';

const Login = Loadable({
  loader: () => import('./Login'),
  loading: Loading,
});

export { Login };
