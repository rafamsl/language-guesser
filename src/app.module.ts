import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleModule } from './sample/sample.module';
import { AnswerModule } from './answer/answer.module';
import { LanguageModule } from './language/language.module';

@Module({
  imports: [SampleModule, AnswerModule, LanguageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
