import { Loading } from '@aurora_app/ui-library';
import Loadable from 'react-loadable';

const FillNewPassword = Loadable({
  loader: () => import('./FillNewPassword'),
  loading: Loading,
});

const ForgotPassword = Loadable({
  loader: () => import('./ForgotPassword'),
  loading: Loading,
});

export { ForgotPassword, FillNewPassword };
