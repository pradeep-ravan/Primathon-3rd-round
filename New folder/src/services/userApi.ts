import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './apiRequest';
import { API_ENDPOINTS } from '@/config/apiEndpoints';
import {
  User,
  UsersResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserQueryParams,
  UserStatistics,
  UserValidation,
  MOCK_USERS,
} from '@/types/user';

/**
 * User Management API Service
 * Using static mock data for demonstration
 */

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility function to base64 encode IDs for API endpoints
// The API expects IDs in the format: base64({"data":"value"})
const encodeIdForApi = (value: string, forceEncode: boolean = false): string => {
  if (!value) return value;
  
  // If forceEncode is true, always encode (useful for domain names)
  if (!forceEncode) {
    // Check if already base64 encoded (try to decode and check format)
    try {
      const decoded = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
      // Check if decoded value is valid JSON with "data" field
      const parsed = JSON.parse(decoded);
      if (parsed && typeof parsed === 'object' && 'data' in parsed) {
        return value; // Already encoded in the correct format
      }
    } catch {
      // Not base64 or not in expected format, proceed to encode
    }
  }
  
  // Encode as {"data":"value"} then base64 encode
  const jsonData = JSON.stringify({ data: value });
  return btoa(jsonData);
};

// Transform API response to User type
interface ApiUserResponse {
  id?: string; // Base64 encoded account ID from API
  plan_id?: string;
  name?: string;
  email?: string;
  display_email?: string;
  account_type?: string;
  account_state?: string;
  admin_type?: string;
  quota?: {
    mailbox_size?: number;
    mailbox_quota?: number;
  };
  service_info?: {
    meeting_support?: boolean;
    desktop_support?: boolean;
    activesync_support?: boolean;
    recording_support?: boolean;
    meeting_value?: boolean;
    meeting_editable?: boolean;
    activesync_value?: boolean;
    activesync_editable?: boolean;
    desktop_value?: boolean;
    desktop_editable?: boolean;
    recording_value?: boolean;
    recording_editable?: boolean;
  };
}

interface ApiUsersResponse {
  page: string | number;
  limit: string | number;
  items: ApiUserResponse[];
  total_count: number;
}

const transformApiUserToUser = (apiUser: ApiUserResponse): User => {
  const email = apiUser.display_email || apiUser.email || '';
  const name = apiUser.name || '';
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    id: email,
    type: (apiUser.account_type as any) || 'ACCOUNT',
    alias: name || email.split('@')[0] || 'user',
    avatar: '',
    display_email: email,
    admin_type: (apiUser.admin_type as any) || 'USER',
    status: (apiUser.account_state as any) || 'NONE',
    email_alias: email.split('@')[0] || '',
    phone_alias: '',
    trash_support: true,
    two_factor_enabled: false,
    two_factor_support: true,
    teamchat_support: apiUser.service_info?.meeting_support || false,
    meeting_support: apiUser.service_info?.meeting_support || false,
    activesync_support: apiUser.service_info?.activesync_support || false,
    sms_support: false,
    socks_support: false,
    im_support: false,
    im_history_support: false,
    delivery_support: true,
    rules_support: true,
    plan_id: apiUser.plan_id, // Keep plan_id for reference
    account_id: apiUser.id, // Store id from API for use as accountId in DELETE operations
    v_card: {
      id: email,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      owner: email,
      is_private: false,
      html_description: false,
      note: '',
      title: '',
      tags: [],
      description: '',
      classify_as: name || email,
      nickname: email.split('@')[0] || '',
      company: '',
      job_title: '',
      spouse: '',
      internet_free_busy: '',
      profession: '',
      department: '',
      assistant_name: '',
      manager_name: '',
      first_name: firstName,
      middle_name: '',
      surname: lastName,
      honorable_suffix: '',
      office_location: '',
      birthday: '',
      anniversary: '',
      gender: 'UNDEFINED' as const,
      edit_counter: 0,
      webpage: '',
      email: email,
      email2: '',
      email3: '',
      im: '',
      im2: '',
      im3: '',
      address: {
        home: { street: '', city: '', state: '', country: '', zip: '' },
        business: { street: '', city: '', state: '', country: '', zip: '' },
        other: { street: '', city: '', state: '', country: '', zip: '' },
      },
      phone: {
        work: '',
        work2: '',
        home: '',
        home2: '',
        assistant: '',
        fax_home: '',
        fax_work: '',
        callback: '',
        company: '',
        car: '',
        isnd: '',
        mobile: '',
        other: '',
        other_fax: '',
        pager: '',
        primary: '',
        telex: '',
        radio: '',
        hearing: '',
      },
      attachments: [],
    },
    plan: {
      id: apiUser.plan_id ? parseInt(apiUser.plan_id) : 1,
      label: 'Standard',
      price: 0,
      currency: 'USD',
    },
  };
};

// Account Details API Response Interface
export interface AccountDetailsResponse {
  name: string;
  surname: string;
  avatar: string | null;
  email: string;
  display_email: string;
  mailbox: string;
  comment: string;
  description: string | null;
  remote_address: string;
  account_type: string;
  account_state: string;
  admin_type: string;
  domain_admin: boolean;
  spam_admin: boolean;
  two_factor_enabled: boolean;
  quota: {
    mailbox_size: number;
    mailbox_quota: number;
  };
  last_login_ip: string;
  last_login_time: string | null;
  messages_sent_today: number;
  send_limit: number;
  alias_list: string[];
  group_list: string[];
  service_info: {
    meeting_support: boolean;
    desktop_support: boolean;
    activesync_support: boolean;
    recording_support: boolean;
    smtp: boolean;
    archive: boolean;
    antivirus: boolean;
    instant_messaging: boolean;
    team_chat: boolean;
    sip: boolean;
    meeting_value: boolean;
    meeting_editable: boolean;
    activesync_value: boolean;
    activesync_editable: boolean;
    desktop_value: boolean;
    desktop_editable: boolean;
    recording_value: boolean;
    recording_editable: boolean;
  };
  saas_plan: string;
  fulltext_status: Record<string, any> | null;
  card: {
    body: string;
    anniversary: string | null;
    birthday: string | null;
    assistant_name: string;
    company_name: string;
    department: string;
    file_as: string;
    first_name: string;
    job_title: string;
    last_name: string;
    manager_name: string;
    middle_name: string;
    nickname: string;
    office_location: string;
    spouse: string;
    suffix: string;
    title: string;
    webpage: string;
    certificate: string;
    freebusy_url: string;
    profession: string;
    sensitivity: number;
    gender: number;
    business_address_city: string;
    business_address_country: string;
    business_address_postal_code: string;
    business_address_state: string;
    business_address_street: string;
    business_address_post_office_box: string;
    home_address_city: string;
    home_address_country: string;
    home_address_postal_code: string;
    home_address_state: string;
    home_address_street: string;
    home_address_post_office_box: string;
    email_1_address: string; // Changed from email1_address to email_1_address
    email_2_address: string; // Changed from email2_address to email_2_address
    email_3_address: string; // Changed from email3_address to email_3_address
    im_address: string;
    homepage: string;
    homepage_2: string; // Changed from homepage2 to homepage_2
    assistant_telephone_number: string;
    business_fax_number: string;
    business_telephone_number: string;
    business_2_telephone_number: string; // Changed from business2_telephone_number
    car_telephone_number: string;
    company_main_telephone_number: string;
    home_fax_number: string;
    home_telephone_number: string;
    home_2_telephone_number: string; // Changed from home2_telephone_number
    mobile_telephone_number: string;
    pager_number: string;
    radio_telephone_number: string;
    callback_telephone_number: string;
    isdn_number: string;
    other_fax_number: string;
    primary_telephone_number: string;
    telex_number: string;
    hearing_number: string;
    other_number: string;
  };
  email_settings: {
    do_not_forward_spam: boolean;
    forward_to: string;
    alternate_email: string;
    mail_in: string;
    mail_out: string;
    spam_reports_mode: string;
    spam_folder: string;
    responder: {
      responder_type: string | number; // Can be string like "DISABLED" or number
      respond_period: number;
      respond_between_from: string;
      respond_between_to: string;
      respond_only_if_to_me: boolean;
    };
  };
  limits: {
    max_box: number;
    max_box_size: number;
    number_send_limit: number;
    megabyte_send_limit: number;
    max_message_size: number;
    delete_older: boolean;
    delete_older_days: number;
    spam_delete_older: boolean;
    local_domain: boolean;
    inactive_for: number;
    account_valid: boolean;
    account_valid_till_date: string;
    validity_report: boolean;
    validity_report_days: number;
    delete_expire: boolean;
  };
}

// User CRUD Operations
export const userApi = {
  // Get account details by domain ID and account ID
  getAccountDetails: async (
    domainId: string,
    accountId: string
  ): Promise<AccountDetailsResponse> => {
    // Encode both IDs for API
    const encodedDomainId = encodeIdForApi(domainId);
    const encodedAccountId = encodeIdForApi(accountId);
    
    const response = await apiGet<AccountDetailsResponse>(
      API_ENDPOINTS.USERS.GET_ACCOUNT_DETAILS(encodedDomainId, encodedAccountId)
    );
    
    return response.data;
  },

  // Partially update account settings by domain ID and account ID
  patchAccount: async (
    domainId: string,
    accountId: string,
    data: Partial<{
      name?: string;
      surname?: string;
      description?: string;
      comment?: string;
      alias_list?: string[];
      account_state?: string;
      admin_type?: string;
      card?: Partial<AccountDetailsResponse['card']>;
      email_settings?: Partial<AccountDetailsResponse['email_settings']>;
      quota?: Partial<AccountDetailsResponse['quota']>;
      limits?: Partial<AccountDetailsResponse['limits']>;
    }>
  ): Promise<AccountDetailsResponse> => {
    // Encode both IDs for API
    const encodedDomainId = encodeIdForApi(domainId);
    const encodedAccountId = encodeIdForApi(accountId);
    
    const response = await apiPatch<AccountDetailsResponse>(
      API_ENDPOINTS.USERS.UPDATE_ACCOUNT(encodedDomainId, encodedAccountId),
      data
    );
    
    return response.data;
  },

  // Reset user password by domain ID and account ID
  resetPassword: async (
    domainId: string,
    accountId: string,
    newPassword?: string
  ): Promise<{ message: string }> => {
    // Encode both IDs for API
    const encodedDomainId = encodeIdForApi(domainId);
    const encodedAccountId = encodeIdForApi(accountId);
    
    const requestData = newPassword ? { new_password: newPassword } : {};
    
    const response = await apiPost<{ message: string }>(
      API_ENDPOINTS.USERS.RESET_PASSWORD(encodedDomainId, encodedAccountId),
      requestData
    );
    
    return response.data;
  },

  // Get users by domain ID
  getUsersByDomainId: async (
    domainId: string,
    params: Omit<UserQueryParams, 'domain_id'> = {}
  ): Promise<UsersResponse> => {
    const response = await apiGet<ApiUsersResponse>(
      API_ENDPOINTS.USERS.GET_BY_DOMAIN_ID(domainId),
      {
        page: params.page || 0,
        limit: params.limit || 10,
        search_query: params.search_query || '',
        sort: params.sort || 'username:asc',
      }
    );
    
    // Transform API response to match User type
    const transformedItems = response.data.items.map(transformApiUserToUser);
    
    return {
      page: typeof response.data.page === 'string' ? parseInt(response.data.page) : response.data.page,
      limit: typeof response.data.limit === 'string' ? parseInt(response.data.limit) : response.data.limit,
      total_count: response.data.total_count,
      items: transformedItems,
    };
  },

  // Get all users with pagination and filtering
  getUsers: async (params: UserQueryParams = {}): Promise<UsersResponse> => {
    // Always require domain_id - use domain-specific endpoint
    if (params.domain_id) {
      return userApi.getUsersByDomainId(params.domain_id, {
        page: params.page,
        limit: params.limit,
        search_query: params.search_query,
        sort: params.sort,
        status: params.status,
        type: params.type,
        two_factor_enabled: params.two_factor_enabled,
      });
    }

    // If no domain_id provided, return empty result (domain is required)
    return {
      page: params.page || 0,
      limit: params.limit || 10,
      total_count: 0,
      items: [],
    };

    // Apply search filter
    if (params.search_query) {
      const query = params.search_query.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.alias.toLowerCase().includes(query) ||
          user.display_email.toLowerCase().includes(query) ||
          user.v_card?.classify_as?.toLowerCase().includes(query) ||
          user.v_card?.first_name?.toLowerCase().includes(query) ||
          user.v_card?.surname?.toLowerCase().includes(query) ||
          user.v_card?.company?.toLowerCase().includes(query) ||
          user.v_card?.job_title?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (params.status) {
      filteredUsers = filteredUsers.filter(
        (user) => user.status === params.status
      );
    }

    // Apply type filter
    if (params.type) {
      filteredUsers = filteredUsers.filter((user) => user.type === params.type);
    }

    // Apply domain filter - for now we'll use a simple approach
    // In the future, this will be handled by the backend API
    if (params.domain_id) {
      // For now, we'll filter based on email domain
      const domainMap: Record<string, string> = {
        'domain-1': 'domain1.com',
        'domain-2': 'domain2.com',
      };
      const targetDomain = domainMap[params.domain_id];
      if (targetDomain) {
        filteredUsers = filteredUsers.filter((user) =>
          user.display_email.endsWith(`@${targetDomain}`)
        );
      }
    }

    // Apply email verification filter - not available in new API structure
    // if (params.is_email_verified !== undefined) {
    //   filteredUsers = filteredUsers.filter(user => user.is_email_verified === params.is_email_verified);
    // }

    // Apply 2FA filter
    if (params.two_factor_enabled !== undefined) {
      filteredUsers = filteredUsers.filter(
        (user) => user.two_factor_enabled === params.two_factor_enabled
      );
    }

    // Apply sorting
    if (params.sort) {
      const [field, direction] = params.sort.split(':');
      filteredUsers.sort((a, b) => {
        const aValue = (a as any)[field];
        const bValue = (b as any)[field];

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      page,
      limit,
      total_count: filteredUsers.length,
      items: paginatedUsers,
    };
  },

  // Get a single user by ID
  getUser: async (id: string): Promise<User> => {
    await delay(200);

    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  },

  // Create a new user by domain ID (using POST API)
  createUserByDomain: async (
    domainId: string,
    data: {
      mailbox: string;
      password: string;
      name: string;
      surname: string;
    }
  ): Promise<User> => {
    const response = await apiPost<ApiUserResponse>(
      API_ENDPOINTS.USERS.CREATE(domainId),
      {
        mailbox: data.mailbox,
        password: data.password,
        name: data.name,
        surname: data.surname,
      }
    );

    // Transform API response to User type
    return transformApiUserToUser(response.data);
  },

  // Create a new user (legacy - for backward compatibility)
  createUser: async (data: CreateUserRequest): Promise<User> => {
    // If domain_id is provided, use the domain-specific endpoint
    if ((data as any).domain_id) {
      return userApi.createUserByDomain((data as any).domain_id, {
        mailbox: data.alias || data.username || '',
        password: data.password || '',
        name: data.first_name || '',
        surname: data.last_name || '',
      });
    }

    // Otherwise use mock data (legacy behavior)
    await delay(500);

    const newUser: User = {
      id: data.display_email || `user${MOCK_USERS.length + 1}@icewarp.com`,
      type: data.type || 'ACCOUNT',
      alias: data.alias || data.username || 'newuser',
      avatar: '/account/avatar/default',
      display_email:
        data.display_email ||
        data.email ||
        `user${MOCK_USERS.length + 1}@icewarp.com`,
      admin_type: 'USER',
      status: 'PENDING',
      email_alias: data.alias || data.username || 'newuser',
      phone_alias: data.phone || '',
      trash_support: true,
      two_factor_enabled: false,
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
        id: `new_user_${Date.now()}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        owner: `owner_${Date.now()}`,
        is_private: true,
        html_description: true,
        note: '',
        title: '',
        tags: [],
        description: '',
        classify_as:
          data.first_name && data.last_name
            ? `${data.first_name} ${data.last_name}`
            : data.alias || 'New User',
        nickname: data.alias || 'newuser',
        company: data.company || '',
        job_title: data.job_title || '',
        spouse: '',
        internet_free_busy: '',
        profession: '',
        department: data.department || '',
        assistant_name: '',
        manager_name: '',
        first_name: data.first_name || '',
        middle_name: '',
        surname: data.last_name || '',
        honorable_suffix: '',
        office_location: '',
        birthday: '',
        anniversary: '',
        gender: 'UNDEFINED',
        edit_counter: 0,
        webpage: '',
        email:
          data.display_email ||
          data.email ||
          `user${MOCK_USERS.length + 1}@icewarp.com`,
        email2: '',
        email3: '',
        im: data.alias || 'newuser',
        im2: '',
        im3: '',
        address: {
          home: { street: '', city: '', state: '', country: '', zip: '' },
          business: { street: '', city: '', state: '', country: '', zip: '' },
          other: { street: '', city: '', state: '', country: '', zip: '' },
        },
        phone: {
          work: data.phone || '',
          work2: '',
          home: '',
          home2: '',
          assistant: '',
          fax_home: '',
          fax_work: '',
          callback: '',
          company: '',
          car: '',
          isnd: '',
          mobile: '',
          other: '',
          other_fax: '',
          pager: '',
          primary: data.phone || '',
          telex: '',
          radio: '',
          hearing: '',
        },
        attachments: [],
      },
      plan: {
        id: 1,
        label: 'Basic',
        price: 0,
        currency: 'USD',
      },
    };

    MOCK_USERS.push(newUser);
    return newUser;
  },

  // Update a user
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    await delay(400);

    const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    const updatedUser = {
      ...MOCK_USERS[userIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };

    // Update full_name if first_name or last_name changed
    if (data.first_name || data.last_name) {
      updatedUser.full_name = `${updatedUser.first_name} ${updatedUser.last_name}`;
    }

    MOCK_USERS[userIndex] = updatedUser;
    return updatedUser;
  },

  // Delete a user by domain ID and account ID (using DELETE API)
  deleteUserByDomain: async (
    domainId: string,
    accountId: string,
    transferTo?: string
  ): Promise<void> => {
    // accountId is already base64 encoded from API, but ensure it's in correct format
    const encodedAccountId = encodeIdForApi(accountId);
    
    // Encode transferTo (domain name) if provided
    // transferTo should be the plain domain name (e.g., "testpk"), not the domain ID
    // Always encode it as base64({"data":"domainname"})
    // Use forceEncode=true to ensure we always encode domain names, even if they look like base64
    const encodedTransferTo = transferTo ? encodeIdForApi(transferTo, true) : undefined;
    
    const params = encodedTransferTo ? { transfer_to: encodedTransferTo } : undefined;
    await apiDelete(
      API_ENDPOINTS.USERS.DELETE(domainId, encodedAccountId),
      params
    );
  },

  // Delete a user (legacy - for backward compatibility)
  deleteUser: async (id: string, domainId?: string, transferTo?: string, accountId?: string): Promise<void> => {
    // If domainId is provided, use the domain-specific endpoint
    if (domainId) {
      // Use accountId (id from API) if provided, otherwise fall back to id
      const finalAccountId = accountId || id;
      return userApi.deleteUserByDomain(domainId, finalAccountId, transferTo);
    }

    // Otherwise use mock data (legacy behavior)
    await delay(300);

    const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    MOCK_USERS.splice(userIndex, 1);
  },

  // User Status Operations
  activateUser: async (id: string): Promise<User> => {
    await delay(200);

    const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      status: 'ACTIVE',
      updated_at: new Date().toISOString(),
    };

    return MOCK_USERS[userIndex];
  },

  deactivateUser: async (id: string): Promise<User> => {
    await delay(200);

    const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      status: 'INACTIVE',
      updated_at: new Date().toISOString(),
    };

    return MOCK_USERS[userIndex];
  },

  suspendUser: async (id: string, reason?: string): Promise<User> => {
    await delay(200);

    const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      status: 'SUSPENDED',
      updated_at: new Date().toISOString(),
    };

    return MOCK_USERS[userIndex];
  },

  // User Statistics
  getUserStatistics: async (): Promise<UserStatistics> => {
    await delay(200);

    const totalUsers = MOCK_USERS.length;
    const activeUsers = MOCK_USERS.filter((u) => u.status === 'ACTIVE').length;
    const inactiveUsers = MOCK_USERS.filter(
      (u) => u.status === 'INACTIVE'
    ).length;
    const suspendedUsers = MOCK_USERS.filter(
      (u) => u.status === 'SUSPENDED'
    ).length;
    const pendingUsers = MOCK_USERS.filter(
      (u) => u.status === 'PENDING'
    ).length;
    const adminUsers = MOCK_USERS.filter((u) => u.type === 'ADMIN').length;
    const accountUsers = MOCK_USERS.filter((u) => u.type === 'ACCOUNT').length;
    const usersWith2FA = MOCK_USERS.filter((u) => u.two_factor_enabled).length;
    const usersOnline = MOCK_USERS.filter((u) => u.status === 'ACTIVE').length; // Mock online users

    return {
      total_users: totalUsers,
      active_users: activeUsers,
      inactive_users: inactiveUsers,
      suspended_users: suspendedUsers,
      pending_users: pendingUsers,
      admin_users: adminUsers,
      account_users: accountUsers,
      users_with_2fa: usersWith2FA,
      users_online: usersOnline,
    };
  },

  // User Validation
  validateUser: async (
    userData: Partial<CreateUserRequest>
  ): Promise<UserValidation> => {
    await delay(200);

    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Email validation
    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        errors.push('Invalid email format');
      }

      // Check if email already exists
      const existingUser = MOCK_USERS.find((u) => u.email === userData.email);
      if (existingUser) {
        errors.push('Email already exists');
      }
    }

    // Username validation
    if (userData.username) {
      const usernameRegex = /^[a-zA-Z0-9._-]+$/;
      if (!usernameRegex.test(userData.username)) {
        errors.push(
          'Username can only contain letters, numbers, dots, underscores, and hyphens'
        );
      }

      if (userData.username.length < 3) {
        errors.push('Username must be at least 3 characters long');
      }

      // Check if username already exists
      const existingUser = MOCK_USERS.find(
        (u) => u.username === userData.username
      );
      if (existingUser) {
        errors.push('Username already exists');
      }
    }

    // Name validation
    if (userData.first_name && userData.first_name.length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (userData.last_name && userData.last_name.length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }

    // Phone validation
    if (userData.phone) {
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(userData.phone)) {
        warnings.push('Phone number format may be invalid');
      }
    }

    // Password validation
    if (userData.password) {
      if (userData.password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
        suggestions.push(
          'Password should contain uppercase, lowercase, and numbers'
        );
      }
    }

    return {
      is_valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  },

  // Bulk operations
  bulkActivateUsers: async (ids: string[]): Promise<User[]> => {
    await delay(500);

    const promises = ids.map((id) => userApi.activateUser(id));
    return Promise.all(promises);
  },

  bulkDeactivateUsers: async (ids: string[]): Promise<User[]> => {
    await delay(500);

    const promises = ids.map((id) => userApi.deactivateUser(id));
    return Promise.all(promises);
  },

  bulkDeleteUsers: async (ids: string[]): Promise<void> => {
    await delay(500);

    const promises = ids.map((id) => userApi.deleteUser(id));
    await Promise.all(promises);
  },

  // Bulk import users
  bulkImportUsers: async (
    file: File
  ): Promise<{
    imported: number;
    failed: number;
    errors: Array<{
      row: number;
      message: string;
      data: Record<string, string>;
    }>;
  }> => {
    await delay(1500);

    try {
      const text = await file.text();
      // Split by newline and filter out empty lines
      const lines = text.split(/\r\n|\n/).filter((line) => line.trim() !== '');

      // Check if we have data (header + at least one row)
      if (lines.length <= 1) {
        return {
          imported: 0,
          failed: 0,
          errors: [
            {
              row: 0,
              message: 'File is empty or contains only header',
              data: {},
            },
          ],
        };
      }

      const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const dataLines = lines.slice(1);

      let importedCount = 0;
      let failedCount = 0;
      const errors: Array<{
        row: number;
        message: string;
        data: Record<string, string>;
      }> = [];

      // Process each line
      dataLines.forEach((line, index) => {
        try {
          const values = line.split(',').map((v) => v.trim());
          const rowData: Record<string, string> = {};

          // Map values to header
          header.forEach((col, i) => {
            if (i < values.length) {
              rowData[col] = values[i];
            }
          });

          // Basic validation - check if we have enough columns
          if (values.length < 3) {
            // Assuming username, email, password are required
            failedCount++;
            errors.push({
              row: index + 2,
              message: 'Not enough columns',
              data: rowData,
            });
            return;
          }

          // Extract data
          const username = rowData['username'] || values[0];
          const email = rowData['email'] || values[1];
          const firstName = rowData['first_name'] || values[2];
          const lastName = rowData['last_name'] || values[3];
          const password = rowData['password'] || values[4];
          const role = (rowData['role'] || values[5] || 'USER').toUpperCase();

          // Validation
          if (!username) {
            failedCount++;
            errors.push({
              row: index + 2,
              message: 'Username is required',
              data: rowData,
            });
            return;
          }

          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            failedCount++;
            errors.push({
              row: index + 2,
              message: 'Invalid email format',
              data: rowData,
            });
            return;
          }

          if (!password) {
            failedCount++;
            errors.push({
              row: index + 2,
              message: 'Password is required',
              data: rowData,
            });
            return;
          }

          // Create new user object
          const newUser: User = {
            id: email,
            type: (['ACCOUNT', 'ADMIN', 'MODERATOR', 'USER'].includes(role)
              ? role
              : 'USER') as any,
            alias: username,
            avatar: '',
            display_email: email,
            admin_type: role === 'ADMIN' ? 'ADMIN' : 'USER',
            status: 'ACTIVE',
            email_alias: '',
            phone_alias: '',
            trash_support: true,
            two_factor_enabled: false,
            two_factor_support: true,
            teamchat_support: true,
            meeting_support: true,
            activesync_support: true,
            sms_support: false,
            socks_support: false,
            im_support: true,
            im_history_support: true,
            delivery_support: true,
            rules_support: true,
            v_card: {
              id: Math.random().toString(36).substring(7),
              created: new Date().toISOString(),
              modified: new Date().toISOString(),
              owner: email,
              is_private: false,
              html_description: false,
              note: '',
              title: '',
              tags: [],
              description: '',
              classify_as: `${firstName} ${lastName}`.trim() || username,
              nickname: username,
              company: '',
              job_title: '',
              spouse: '',
              internet_free_busy: '',
              profession: '',
              department: '',
              assistant_name: '',
              manager_name: '',
              first_name: firstName || '',
              middle_name: '',
              surname: lastName || '',
              honorable_suffix: '',
              office_location: '',
              birthday: '',
              anniversary: '',
              gender: 'UNDEFINED',
              edit_counter: 0,
              webpage: '',
              email: email,
              email2: '',
              email3: '',
              im: '',
              im2: '',
              im3: '',
              address: {
                home: { street: '', city: '', state: '', country: '', zip: '' },
                business: {
                  street: '',
                  city: '',
                  state: '',
                  country: '',
                  zip: '',
                },
                other: {
                  street: '',
                  city: '',
                  state: '',
                  country: '',
                  zip: '',
                },
              },
              phone: {
                work: '',
                work2: '',
                home: '',
                home2: '',
                assistant: '',
                fax_home: '',
                fax_work: '',
                callback: '',
                company: '',
                car: '',
                isnd: '',
                mobile: '',
                other: '',
                other_fax: '',
                pager: '',
                primary: '',
                telex: '',
                radio: '',
                hearing: '',
              },
              attachments: [],
            },
            plan: {
              id: 1,
              label: 'Standard',
              price: 0,
              currency: 'USD',
            },
          };

          // Add to mock data
          MOCK_USERS.push(newUser);
          importedCount++;
        } catch (err) {
          failedCount++;
          errors.push({
            row: index + 2,
            message: 'Failed to process',
            data: {},
          });
        }
      });

      return {
        imported: importedCount,
        failed: failedCount,
        errors: errors,
      };
    } catch (e) {
      console.error('Error parsing mock file', e);
      return {
        imported: 0,
        failed: 1,
        errors: [
          {
            row: 0,
            message: 'Failed to read file',
            data: {},
          },
        ],
      };
    }
  },

  // User search
  searchUsers: async (query: string): Promise<User[]> => {
    await delay(200);

    const searchQuery = query.toLowerCase();
    return MOCK_USERS.filter(
      (user) =>
        user.alias.toLowerCase().includes(searchQuery) ||
        user.display_email.toLowerCase().includes(searchQuery) ||
        user.v_card?.classify_as?.toLowerCase().includes(searchQuery) ||
        user.v_card?.first_name?.toLowerCase().includes(searchQuery) ||
        user.v_card?.surname?.toLowerCase().includes(searchQuery) ||
        user.v_card?.company?.toLowerCase().includes(searchQuery) ||
        user.v_card?.job_title?.toLowerCase().includes(searchQuery) ||
        user.v_card?.department?.toLowerCase().includes(searchQuery)
    );
  },

  // Toggle 2FA
  toggleTwoFactor: async (id: string, enabled: boolean): Promise<User> => {
    await delay(200);

    const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      two_factor_enabled: enabled,
      updated_at: new Date().toISOString(),
    };

    return MOCK_USERS[userIndex];
  },

  // Update user permissions
  updateUserPermissions: async (
    id: string,
    permissions: Partial<UserPermissions>
  ): Promise<User> => {
    await delay(200);

    const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      permissions: {
        ...MOCK_USERS[userIndex].permissions,
        ...permissions,
      },
      updated_at: new Date().toISOString(),
    };

    return MOCK_USERS[userIndex];
  },

  // Update user preferences
  updateUserPreferences: async (
    id: string,
    preferences: Partial<UserPreferences>
  ): Promise<User> => {
    await delay(200);

    const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      preferences: {
        ...MOCK_USERS[userIndex].preferences,
        ...preferences,
      },
      updated_at: new Date().toISOString(),
    };

    return MOCK_USERS[userIndex];
  },
};

export default userApi;
