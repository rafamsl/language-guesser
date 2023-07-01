import { Module } from '@nestjs/common';
import { LanguageModule } from 'src/language/language.module';
import { LanguageService } from 'src/language/language.service';
import { SampleModule } from 'src/sample/sample.module';
import { SampleService } from 'src/sample/sample.service';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

@Module({
  controllers: [AnswerController],
  providers: [AnswerService, SampleService, LanguageService]
})
export class AnswerModule {}
