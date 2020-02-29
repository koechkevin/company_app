import { Loading } from '@aurora_app/ui-library';
import * as React from 'react';
import Loadable from 'react-loadable';

import { registerModel } from '../../utils';
import { Job as JobTyped } from './models/typed.d';

export type Job = JobTyped;

const Jobs = Loadable.Map({
  loader: {
    Jobs: () => import('./Jobs'),
    jobsModel: () => import('./models/jobs'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Jobs = loaded.Jobs.default;
    const jobsModel = loaded.jobsModel.default;

    registerModel(props.app, jobsModel);

    return <Jobs {...props} />;
  },
});

export { Jobs };
