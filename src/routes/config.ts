import {
  faChartBar,
  faCog,
  faHome,
  faSuitcase,
  faUsers,
  faUserTie,
  IconDefinition,
} from '@fortawesome/pro-regular-svg-icons';

import { AppPages } from '../pages';
import { Routes } from './Routes';

export interface RouteConfig {
  name: string;
  path: string;
  query?: string;
  auth?: string;
  routes?: RouteConfig[];
  icon?: IconDefinition;
  hideInMenu?: boolean;
  component?:
    | (React.ComponentClass<any, any> & LoadableExport.LoadableComponent)
    | (React.FunctionComponent<any> & LoadableExport.LoadableComponent);
}

const { Home, Jobs, Channel, NotFound, Settings, Members, User, MyProfile, Compliance, CompanyProfile } = AppPages;

const menu = [
  {
    name: 'Home',
    icon: faHome,
    path: Routes.Home,
  },
  {
    name: 'Jobs',
    icon: faSuitcase,
    path: Routes.Jobs,
  },
  {
    name: 'Candidates',
    icon: faUsers,
    path: Routes.Candidates,
  },
];

const routesConfig: RouteConfig[] = [
  {
    name: 'Home',
    icon: faChartBar,
    path: '/app/home',
    component: Home,
  },
  {
    name: 'Jobs',
    icon: faUserTie,
    path: '/app/jobs',
    component: Jobs,
  },
  {
    name: 'Chat',
    path: '/app/channel/:id',
    component: Channel,
  },
  {
    name: 'Settings',
    icon: faCog,
    path: '/app/settings',
    component: Settings,
    hideInMenu: true,
    routes: [
      {
        name: 'Account',
        path: '/app/settings/account',
        component: Settings,
        routes: [
          {
            name: 'Profile Overview',
            path: '/app/settings/account/my-profile',
            component: MyProfile,
          },
        ],
      },
      {
        name: 'Company',
        path: '/app/settings/company',
        component: Settings,
        routes: [
          {
            name: 'Company Profile',
            path: '/app/settings/company/profile',
            component: CompanyProfile,
          },
          {
            name: 'Activity Log',
            path: '/app/settings/company/activity-log',
          },
          {
            name: 'Export Data',
            path: '/app/settings/company/export-data',
          },
          {
            name: 'Compliance',
            path: '/app/settings/company/compliance',
            component: Compliance,
            auth: 'company-admin',
          },
        ],
      },
      {
        name: 'Team',
        path: '/app/settings/team',
        component: Settings,
        routes: [
          {
            name: 'Members',
            hideInMenu: true,
            path: '/app/settings/team/members/profile/:profileId',
            component: User,
            auth: 'company-admin',
          },
          {
            name: 'Members',
            path: '/app/settings/team/members',
            component: Members,
          },
          {
            name: 'Permissions',
            path: '/app/settings/team/permissions',
          },
        ],
      },
      {
        name: 'Billing',
        path: '/app/settings/billing',
        component: Settings,
        routes: [
          {
            name: 'Payments',
            path: '/app/settings/billing/payments',
          },
          {
            name: 'History',
            path: '/app/settings/billing/history',
          },
          {
            name: 'Estimate',
            path: '/app/settings/billing/estimate',
          },
        ],
      },
    ],
  },
  {
    name: '404 Not Found',
    hideInMenu: true,
    path: '/app/exception/404',
    component: NotFound,
  },
];

export { routesConfig, menu };
