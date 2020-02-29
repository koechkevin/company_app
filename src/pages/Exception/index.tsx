import { Loading } from '@aurora_app/ui-library';
import Loadable from 'react-loadable';

const Error403 = Loadable({
  loader: () => import('./Error403'),
  loading: Loading,
});

const Error404 = Loadable({
  loader: () => import('./Error404'),
  loading: Loading,
});

const Error500 = Loadable({
  loader: () => import('./Error500'),
  loading: Loading,
});

const NotFound = Loadable({
  loader: () => import('./NotFound'),
  loading: Loading,
});

export { Error403, Error404, Error500, NotFound };
