export default {
    databaseUrl: () => process.env.MONGODB_URI ?? '',
    dev_substition_username: () => (process.env.DEV_SUBST_USER ?? '').toUpperCase(),
}
