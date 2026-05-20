import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggerPlatformModule } from './modules/blogger-platform/blogger-platform.module';
import { TestingModule } from './testing/testing.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://MrSevere:qwertyadmin@ac-4suh2hg-shard-00-00.rtpcxjn.mongodb.net:27017,ac-4suh2hg-shard-00-01.rtpcxjn.mongodb.net:27017,ac-4suh2hg-shard-00-02.rtpcxjn.mongodb.net:27017/?ssl=true&replicaSet=atlas-sa4lbn-shard-0&authSource=admin&appName=Cluster0',
    ),
    BloggerPlatformModule,
    TestingModule,
    UserAccountsModule,
  ],
})
export class AppModule {}
