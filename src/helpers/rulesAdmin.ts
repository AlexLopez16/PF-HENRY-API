import { verifyToken } from "../middlewares/authValidator";
import { AdminRole } from "../middlewares/rolAdminValidator";

export const rulesAdmin = [verifyToken, AdminRole];