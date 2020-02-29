import { Loading } from '@aurora_app/ui-library';
import * as React from 'react';
import Loadable from 'react-loadable';

import { registerModel } from '../../utils';

const Settings = Loadable.Map({
  loader: {
    Settings: () => import('./Settings'),
    model: () => import('./models/settings'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Settings = loaded.Settings.default;
    const model = loaded.model.default;

    registerModel(props.app, model);

    return <Settings {...props} />;
  },
});

const CompanyProfile = Loadable.Map({
  loader: {
    CompanyProfile: () => import('./CompanyProfile/CompanyProfile'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const CompanyProfile = loaded.CompanyProfile.default;

    return <CompanyProfile {...props} />;
  },
});

const Members = Loadable.Map({
  loader: {
    Members: () => import('./Members/Members'),
    model: () => import('./models/members'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Members = loaded.Members.default;
    const model = loaded.model.default;

    registerModel(props.app, model);

    return <Members {...props} />;
  },
});

const User = Loadable.Map({
  loader: {
    User: () => import('./Members/MemberProfile'),
    model: () => import('./models/members'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const User = loaded.User.default;
    const model = loaded.model.default;

    registerModel(props.app, model);

    return <User {...props} />;
  },
});

const MyProfile = Loadable.Map({
  loader: {
    MyProfile: () => import('./MyProfile/MyProfile'),
    model: () => import('../../models/profile'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const MyProfile = loaded.MyProfile.default;
    const model = loaded.model.default;

    registerModel(props.app, model);

    return <MyProfile {...props} />;
  },
});

const Compliance = Loadable.Map({
  loader: {
    Compliance: () => import('./Compliance/Compliance'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Compliance = loaded.Compliance.default;
    return <Compliance {...props} />;
  },
})

export { Settings, Members, User, MyProfile, Compliance, CompanyProfile };
