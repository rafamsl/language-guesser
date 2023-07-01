import { Module } from '@nestjs/common';
import { LanguageModule } from 'src/language/language.module';
import { LanguageService } from 'src/language/language.service';
import { SampleController } from './sample.controller';
import { SampleService } from './sample.service';

@Module({
  controllers: [SampleController],
  providers: [SampleService, LanguageService]
})
export class SampleModule {}
