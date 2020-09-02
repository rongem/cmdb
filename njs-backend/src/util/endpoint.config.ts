export default {
    databaseUrl: () => process.env.MONGODB_URI ?? '',
    authMode: () => (process.env.AUTH_MODE ?? 'ntlm').toLocaleLowerCase(),
    dev_substition_username: () => (process.env.DEV_SUBST_USER ?? '').toUpperCase(),
};
