import { UserDocument } from './modules/user/schemas/user.schema';

declare global {
  namespace Express {
    interface User extends UserDocument {}

    interface Request {
      startTime: number;
    }
  }
}
