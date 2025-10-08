import { Request } from 'express';
import { User } from 'src/auth/entity/auth.entity';

export interface AuthenticatedRequest extends Request {
    user: User;
}
