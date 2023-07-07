import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { LanguageService } from 'src/language/language.service';
import { SampleService } from 'src/sample/sample.service';
import { AnswerService } from './answer.service';

@Controller()
export class AnswerController {
    constructor(private readonly answerService: AnswerService, private readonly sampleService: SampleService, private readonly languageService: LanguageService){};

    @Post('language-guesser/answer')
    @Render('score')
    async create(@Body() formdata: any){
        const answerDTO = await this.answerService.getResult(formdata);
        return {samples: answerDTO.samples, totalScore: answerDTO.totalScore};

    }
}