import { Error403, Error404, Error500, NotFound } from './Exception';
import { FillNewPassword, ForgotPassword } from './ForgotPassword';
import { Home } from './Home';
import { Jobs } from './Jobs';
import { Login } from './Login';
import { Channel } from './Messages';
import { CompanyProfile, Compliance, Members, MyProfile, Settings, User } from './Settings';

/*************** App Pages Config ***************/

export const AppPages = {
  Home,
  Jobs,
  Channel,
  Settings,
  NotFound,
  Members,
  User,
  MyProfile,
  Compliance,
  CompanyProfile,
};

/*************** Public Pages Config ***************/

export const PublicPages = { Login, Error403, Error404, Error500, ForgotPassword, FillNewPassword };
