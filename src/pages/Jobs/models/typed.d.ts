export interface Job {
  id?: string;
  companyId: string;
  ownerId: string;
  jobAsManagement: boolean;
  vacantsNumber: number;
  isRemote: boolean;
  companyInfoAtTop: boolean;
  departmentInfoAtTop: boolean;
  urgencyLevel: string;
  jobType: string;
  experienceLevel: string;
  jobPrivacyType: string;
  jobTitle: string;
  jobId: string;
  startDate: string;
  endDate: string;
  compensationMinBand: number;
  compensationMaxBand: number;
  description: string;
  degreeName: string;
  companyInfo: string;
  departmentId: string;
  departmentInfo: string;
  locationId: string;
  status: string;
  isDeleted: boolean;
  isExpired: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  skills: any[];
  location?: any;
  applicationsCount?: number;
  hiringTeam?: any[];
  owner?: any;
  publicId?: string;
}

export type Jobs = Job[];
