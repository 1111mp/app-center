import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { App } from './schemas/app.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(App.name) private readonly appModule: Model<App>) {}
}
