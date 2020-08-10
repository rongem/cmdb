import { IUser } from '../../src/models/mongoose/user.model';

declare global {
    namespace Express {
        interface Request {
            authentication?: IUser;
            userName?: string;
        }
    }
}