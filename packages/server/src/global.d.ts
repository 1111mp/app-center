import { AppDocument } from './modules/app/schemas/app.schema';
import { UserDocument } from './modules/user/schemas/user.schema';

declare global {
  namespace Express {
    interface User extends UserDocument {}

    interface Request {
      appData: AppDocument;

      startTime: number;
    }
  }
}
