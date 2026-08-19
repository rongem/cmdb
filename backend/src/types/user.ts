export type AuthMode = 'jwt' | 'ntlm' | 'none';

export type AppUser = {
  id: string;
  userName: string;
  roles: string[];
  authMode: AuthMode;
  tenantId?: string;
};

export type RequestContext = {
  requestId: string;
  user?: AppUser;
};
