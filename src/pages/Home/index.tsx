import { Loading } from '@aurora_app/ui-library';
import * as React from 'react';
import Loadable from 'react-loadable';

import { registerModel } from '../../utils';

const Home = Loadable.Map({
  loader: {
    Home: () => import('./Home'),
    model: () => import('./models/Home'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Home = loaded.Home.default;
    const model = loaded.model.default;

    registerModel(props.app, model);

    return <Home {...props} />;
  },
});

export { Home };
