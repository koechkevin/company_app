import { Company, CompanyDepartment } from '../models/company';
import { FileModel } from '../models/file';

// Global declare
declare global {
  interface Window {
    ability: any;
  }
}

// Global auth interface
export interface Auth {
  isChecking: boolean;
  isAuthenticated: boolean;
  permissions: string[];
}

export interface AppKey {
  token: string;
  userToken: string;
  profile?: UserProfile;
  selectedProfile: string;
}

export interface DecodedToken {
  aud: string; // audience
  iss: string; // issuer
  exp: number; // expiration time
  nbf: string;
  iat: string;
  jti: string;
  type: 'user' | 'profile';
}

export interface BasicAuth {
  username: string;
  password: string;
}

// User interface, used only in authorization
export interface User {
  userId: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
  status: string;
  isDeleted?: boolean;
}

// User profile interface
export interface UserProfile {
  profileId: string;
  userId: string;
  productId: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  avatarFileId?: string;
  avatarColor?: string;
  timezone?: string;
  role: string;
  status: string;
  isDeleted: boolean;
  type: string;
  additionalRoles: string[];
  signature?: string;
  email?: string;
  name?: string;

  // Expanded fields
  profile?: CompanyProfile | CandidateProfile | ChatbotProfile;
  avatarUrl?: string;
  signedAvatar?: FileModel;
  user?: any;

  // System fields
  chatStatus: string;
  inCall?: boolean;
}

export interface Address {
  addressCountry: string;
  addressLocality: string;
  addressRegion: string;
}

// Interface describes data model of a user company profile
export interface CompanyProfile {
  profileId: string;
  companyId: string;
  firstname: string;
  lastname: string;
  signature?: string;
  email?: string;
  status: string;
  isDeleted: boolean;
  additionalRoles: string[];
  locationId?: string;
  address?: Address;

  // Expanded fields
  profile?: UserProfile;
  signedAvatar?: FileModel;
  company: Company;
  departments: CompanyDepartment[];
  timezone: string;
  locationId?: string;

  // System fields
  chatStatus: string;
  isTyping?: boolean;
}

export interface CandidateProfile {
  profileId: string;
  firstname: string;
  lastname: string;
  email?: string;
  status: string;
  isDeleted: boolean;

  // Expanded fields
  profile?: UserProfile;
  timezone: string;
  applications: object[]; // todo: should be application interface instead of object

  // System fields
  chatStatus: string;
  isTyping?: boolean;
}

export interface ChatbotProfile {
  profileId: string;
  name: string;
  status: string;
  isDeleted: boolean;
}

export interface ActivityLog {
  id: string;
  createdAt: string;
  avatarUrl: string;
  activity: string;
}
