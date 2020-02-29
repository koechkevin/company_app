import { FileModel } from '../models/file';
import { CompanyProfile } from '../models/user';

// Interface describes Company data model
export interface Company {
  companyId: string;
  name: string;
  avatarColor: string;
  status: string;
  isDeleted: boolean;
  createdBy?: Date;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  auroraUrl?: string;
  logoFileId?: string;
  website?: string;
  language?: string;
  joinDate?: string;
  paidSubscriptionStartDate?: Date;
  contactName?: string;
  phone?: string;
  email?: string;
  description?: string;

  // Expanded fields
  signedLogo: FileModel;
}

// Interface describes CompanyDepartment data model
export interface CompanyDepartment {
  departmentId: string;
  companyId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  status: string;
  isDeleted: boolean;

  // Expanded fields
  members: CompanyProfile[];
}

export interface CompanySettings {
  isEoeEnabled: boolean;
  companyId?: string;
}
