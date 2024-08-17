import { user} from '../models/userModel';

declare global {
    namespace Express {
        interface Request {
            user?: user;
        }
    }
}