export default {
    databaseUrl: () => process.env.MONGODB_URI ?? '',
    authMode: () => (process.env.AUTH_MODE ?? 'ntlm').toLocaleLowerCase(),
    jwt_server_key: () => (process.env.JWT_SERVER_KEY ?? 'This should be exactly 1 real good secret!'),
    dev_substition_username: () => (process.env.DEV_SUBST_USER ?? '').toUpperCase(),
};
