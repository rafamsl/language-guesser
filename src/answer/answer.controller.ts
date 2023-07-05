import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { CreateAnswerDTO } from 'src/dto/create-answer.dto';
import { Answer } from 'src/interfaces/answer/answer.interface';
import { SampleService } from 'src/sample/sample.service';
import { AnswerModule } from './answer.module';
import { AnswerService } from './answer.service';

export class AnswerController {
    constructor(private readonly answerService: AnswerService, private readonly sampleService: SampleService){};

    @Post('language-guesser/answer')
    @Render('score')
    async create(@Body() formdata: any){
        const answerDTO = await this.answerService.getResult(formdata);
        return {samples: answerDTO.samples, totalScore: answerDTO.totalScore};

    }

    @Get('language-guesser/similarity-score')
    async similarityScore(){
        const lang1 = "Portuguese";
        const lang2 = "Spanish";
        return this.answerService.compareLanguages(lang1,lang2);
    }

    

}
