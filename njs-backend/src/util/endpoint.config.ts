export default {
    databaseUrl: () => process.env.MONGODB_URI ?? '',
}
