import { UserRole } from "../enums";


declare global {
    namespace Express {
        interface Request {
            registerData?: {
                name: string;
                email: string;
                password: string;
                role: UserRole;
            };
            user?: {
                id: string;
                role: UserRole;
                name: string;
            };
        }
    }
}

export { };