import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as firebaseConfig from '../firebase.json';

import * as admin from 'firebase-admin'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serviceAccount = firebaseConfig as admin.ServiceAccount;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://teamder-e3309.firebaseio.com'
  })
  await app.listen(3000);
}
bootstrap();
