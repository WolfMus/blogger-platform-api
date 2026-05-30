import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggerPlatformModule } from './modules/blogger-platform/blogger-platform.module';
import { TestingModule } from './testing/testing.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './core/exceptions/filters/http-exception.filter';
import { DomainExceptionFilter } from './core/exceptions/filters/domain-exception.filter';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://MrSevere:qwertyadmin@ac-4suh2hg-shard-00-00.rtpcxjn.mongodb.net:27017,ac-4suh2hg-shard-00-01.rtpcxjn.mongodb.net:27017,ac-4suh2hg-shard-00-02.rtpcxjn.mongodb.net:27017/bloger-platform?ssl=true&replicaSet=atlas-sa4lbn-shard-0&authSource=admin&appName=Cluster0',
    ),
    BloggerPlatformModule,
    TestingModule,
    UserAccountsModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
