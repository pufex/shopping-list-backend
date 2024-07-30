import type { ResponseUserType } from "../../db/user/userModel";

export {}

declare global {
    namespace Express {
        export interface Request {
            user?: ResponseUserType
        }
    }
}