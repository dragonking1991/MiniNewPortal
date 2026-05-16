import { deleteCookie } from "h3";

export default defineEventHandler((event) => {
  deleteCookie(event, "mnp_token");
  return { success: true };
});
