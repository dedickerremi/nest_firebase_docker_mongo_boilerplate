import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';
import {MongooseModule} from '@nestjs/mongoose';
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { PreauthMiddleware } from './middleware/auth.middleware';
import { UsersModule } from './users/users.module';

const mongoUrl = process.env.DB_URL ?? 'mongodb://localhost:27017/myapp'

@Module({
  imports: [
    FirebaseAdminModule,
    MongooseModule.forRoot(
      process.env.DB_URL, 
      {
        useNewUrlParser: true
      }
    ),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(PreauthMiddleware).forRoutes('*');
  }
}