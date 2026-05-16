export default defineEventHandler(async (event) => {
  const { username } = await requireAdmin(event);
  return {
    username,
    isAuthenticated: true
  };
});
