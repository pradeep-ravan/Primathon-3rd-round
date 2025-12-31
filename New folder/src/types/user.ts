// User-related TypeScript interfaces for User Management
// Based on actual API response structure

export interface User {
  id: string; // email address like "john.doe@icewarp.com"
  type: "ACCOUNT" | "ADMIN" | "MODERATOR" | "USER";
  alias: string;
  avatar: string;
  display_email: string;
  admin_type: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: "NONE" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  email_alias: string;
  phone_alias: string;
  trash_support: boolean;
  two_factor_enabled: boolean;
  two_factor_support: boolean;
  teamchat_support: boolean;
  meeting_support: boolean;
  activesync_support: boolean;
  sms_support: boolean;
  socks_support: boolean;
  im_support: boolean;
  im_history_support: boolean;
  delivery_support: boolean;
  rules_support: boolean;
  v_card: VCard;
  plan: UserPlan;
  plan_id?: string; // Plan ID from API (kept for reference)
  account_id?: string; // Account ID from API (base64 encoded), used as accountId for DELETE operations
}

export interface VCard {
  id: string;
  created: string;
  modified: string;
  owner: string;
  is_private: boolean;
  html_description: boolean;
  note: string;
  title: string;
  tags: VCardTag[];
  description: string;
  classify_as: string;
  nickname: string;
  company: string;
  job_title: string;
  spouse: string;
  internet_free_busy: string;
  profession: string;
  department: string;
  assistant_name: string;
  manager_name: string;
  first_name: string;
  middle_name: string;
  surname: string;
  honorable_suffix: string;
  office_location: string;
  birthday: string;
  anniversary: string;
  gender: "MALE" | "FEMALE" | "UNDEFINED";
  edit_counter: number;
  webpage: string;
  email: string;
  email2: string;
  email3: string;
  im: string;
  im2: string;
  im3: string;
  address: VCardAddress;
  phone: VCardPhone;
  attachments: VCardAttachment[];
}

export interface VCardTag {
  id: string;
  name: string;
  color: string;
  usage_count: number;
}

export interface VCardAddress {
  home: AddressDetails;
  business: AddressDetails;
  other: AddressDetails;
}

export interface AddressDetails {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface VCardPhone {
  work: string;
  work2: string;
  home: string;
  home2: string;
  assistant: string;
  fax_home: string;
  fax_work: string;
  callback: string;
  company: string;
  car: string;
  isnd: string;
  mobile: string;
  other: string;
  other_fax: string;
  pager: string;
  primary: string;
  telex: string;
  radio: string;
  hearing: string;
}

export interface VCardAttachment {
  id: string;
  name: string;
  created: string;
  size: number;
  type: "ATTACHMENT" | "IMAGE" | "DOCUMENT";
  generating_preview: boolean;
  ticket: string;
}

export interface UserPlan {
  id: number;
  label: string;
  price: number;
  currency: string;
}

export interface UserPermissions {
  can_manage_users: boolean;
  can_manage_domains: boolean;
  can_manage_groups: boolean;
  can_access_admin_panel: boolean;
  can_manage_settings: boolean;
  can_view_reports: boolean;
  can_manage_billing: boolean;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: "light" | "dark" | "auto";
  email_notifications: boolean;
  sms_notifications: boolean;
  desktop_notifications: boolean;
}

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
export type UserType = "ACCOUNT" | "ADMIN" | "MODERATOR" | "USER";

// API Response types
export interface UsersResponse {
  page: number;
  limit: number;
  total_count: number;
  items: User[];
}

export interface UserResponse {
  data: User;
  message?: string;
  status: number;
  success: boolean;
}

// User creation/update types
export interface CreateUserRequest {
  alias: string;
  display_email: string;
  type?: UserType;
  first_name?: string;
  last_name?: string;
  phone?: string;
  department?: string;
  job_title?: string;
  company?: string;
  password?: string;
  send_welcome_email?: boolean;
  permissions?: Partial<UserPermissions>;
  preferences?: Partial<UserPreferences>;
  // Domain ID for domain-specific user creation
  domain_id?: string;
  // Legacy fields for backward compatibility
  username?: string;
  email?: string;
}

export interface UpdateUserRequest {
  alias?: string;
  display_email?: string;
  type?: UserType;
  first_name?: string;
  last_name?: string;
  phone?: string;
  department?: string;
  job_title?: string;
  company?: string;
  status?: UserStatus;
  permissions?: Partial<UserPermissions>;
  preferences?: Partial<UserPreferences>;
  // Legacy fields for backward compatibility
  username?: string;
  email?: string;
}

// Query parameters for user listing
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search_query?: string;
  sort?: string; // Format: "field:direction" e.g., "username:asc", "email:desc"
  status?: UserStatus;
  type?: UserType;
  domain_id?: string;
  is_email_verified?: boolean;
  two_factor_enabled?: boolean;
}

// User statistics
export interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  pending_users: number;
  admin_users: number;
  account_users: number;
  users_with_2fa: number;
  users_online: number;
}

// User validation
export interface UserValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// Static mock data based on actual API response structure
export const MOCK_USERS: User[] = [
  {
    id: "john.doe@domain1.com",
    type: "ACCOUNT",
    alias: "admin",
    avatar: "/account/avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    display_email: "john.doe@domain1.com",
    admin_type: "USER",
    status: "ACTIVE",
    email_alias: "john.doe",
    phone_alias: "+1-555-0123",
    trash_support: true,
    two_factor_enabled: true,
    two_factor_support: true,
    teamchat_support: true,
    meeting_support: true,
    activesync_support: true,
    sms_support: true,
    socks_support: true,
    im_support: true,
    im_history_support: true,
    delivery_support: true,
    rules_support: true,
    v_card: {
      id: "aWNld2FycC5jb20=",
      created: "2024-01-15T10:30:00Z",
      modified: "2024-01-20T14:22:00Z",
      owner: "eeea4af6-2de2-4a6a-9288-d26644666bcd",
      is_private: true,
      html_description: true,
      note: "Software Engineer",
      title: "Bc. Ing. Mrg.",
      tags: [
        {
          id: "YXdkYXdk",
          name: "work",
          color: "#DADADA",
          usage_count: 99
        }
      ],
      description: "Software Engineer at IceWarp",
      classify_as: "John F. Doe",
      nickname: "john",
      company: "IceWarp",
      job_title: "Software Engineer",
      spouse: "",
      internet_free_busy: "",
      profession: "Software Development",
      department: "Engineering",
      assistant_name: "",
      manager_name: "",
      first_name: "John",
      middle_name: "Fidgerald",
      surname: "Doe",
      honorable_suffix: "PhD.",
      office_location: "London",
      birthday: "1990-01-15",
      anniversary: "2020-06-15",
      gender: "MALE",
      edit_counter: 5,
      webpage: "https://john.doe.example.com",
      email: "john.doe@domain1.com",
      email2: "john.doe@domain1.com",
      email3: "john.doe@domain1.com",
      im: "john.doe",
      im2: "",
      im3: "",
      address: {
        home: {
          street: "123 Main St",
          city: "London",
          state: "England",
          country: "UK",
          zip: "SW1A 1AA"
        },
        business: {
          street: "456 Business Ave",
          city: "London",
          state: "England",
          country: "UK",
          zip: "SW1A 2BB"
        },
        other: {
          street: "",
          city: "",
          state: "",
          country: "",
          zip: ""
        }
      },
      phone: {
        work: "+1-555-0123",
        work2: "",
        home: "+1-555-0124",
        home2: "",
        assistant: "",
        fax_home: "",
        fax_work: "",
        callback: "",
        company: "",
        car: "",
        isnd: "",
        mobile: "+1-555-0125",
        other: "",
        other_fax: "",
        pager: "",
        primary: "+1-555-0123",
        telex: "",
        radio: "",
        hearing: ""
      },
      attachments: []
    },
    plan: {
      id: 1,
      label: "Professional",
      price: 29.99,
      currency: "USD"
    }
  },
  {
    id: "jane.smith@domain2.com",
    type: "ADMIN",
    alias: "jane_admin",
    avatar: "/account/avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgU21pdGgiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    display_email: "jane.smith@domain2.com",
    admin_type: "ADMIN",
    status: "ACTIVE",
    email_alias: "jane.smith",
    phone_alias: "+1-555-0456",
    trash_support: true,
    two_factor_enabled: true,
    two_factor_support: true,
    teamchat_support: true,
    meeting_support: true,
    activesync_support: true,
    sms_support: true,
    socks_support: true,
    im_support: true,
    im_history_support: true,
    delivery_support: true,
    rules_support: true,
    v_card: {
      id: "aWNld2FycC5jb20y",
      created: "2024-01-10T08:45:00Z",
      modified: "2024-01-21T16:30:00Z",
      owner: "eeea4af6-2de2-4a6a-9288-d26644666bce",
      is_private: true,
      html_description: true,
      note: "System Administrator",
      title: "Ms.",
      tags: [
        {
          id: "YXdkYXdkMg",
          name: "admin",
          color: "#FF6B6B",
          usage_count: 50
        }
      ],
      description: "System Administrator at IceWarp",
      classify_as: "Jane Smith",
      nickname: "jane",
      company: "IceWarp",
      job_title: "System Administrator",
      spouse: "",
      internet_free_busy: "",
      profession: "System Administration",
      department: "IT Administration",
      assistant_name: "",
      manager_name: "",
      first_name: "Jane",
      middle_name: "Elizabeth",
      surname: "Smith",
      honorable_suffix: "MSc.",
      office_location: "New York",
      birthday: "1985-03-20",
      anniversary: "2018-09-10",
      gender: "FEMALE",
      edit_counter: 12,
      webpage: "https://jane.smith.example.com",
      email: "jane.smith@domain2.com",
      email2: "jane.smith@domain2.com",
      email3: "jane.smith@domain2.com",
      im: "jane.smith",
      im2: "",
      im3: "",
      address: {
        home: {
          street: "789 Oak St",
          city: "New York",
          state: "NY",
          country: "USA",
          zip: "10001"
        },
        business: {
          street: "321 Corporate Blvd",
          city: "New York",
          state: "NY",
          country: "USA",
          zip: "10002"
        },
        other: {
          street: "",
          city: "",
          state: "",
          country: "",
          zip: ""
        }
      },
      phone: {
        work: "+1-555-0456",
        work2: "",
        home: "+1-555-0457",
        home2: "",
        assistant: "",
        fax_home: "",
        fax_work: "",
        callback: "",
        company: "",
        car: "",
        isnd: "",
        mobile: "+1-555-0458",
        other: "",
        other_fax: "",
        pager: "",
        primary: "+1-555-0456",
        telex: "",
        radio: "",
        hearing: ""
      },
      attachments: []
    },
    plan: {
      id: 2,
      label: "Enterprise",
      price: 99.99,
      currency: "USD"
    }
  }
];
