import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { CreateAnswerDTO } from 'src/dto/create-answer.dto';
import { SampleService } from 'src/sample/sample.service';

@Injectable()
export class AnswerService {
    
    constructor(private sampleService: SampleService){};

    async getResult(formdata: any){
        const samples = this.sampleService.getDailySample().sample;
        const answerLanguages = formdata['language'];
        let totalScore = 0;
        const response = samples.map((obj,index)=>{
            const selectedLanguage = answerLanguages[index];
            let score = 0
            if(selectedLanguage === obj.language){
                score = 1
                totalScore += 1;
            }
            return {...obj, selectedLanguage, score}
        })
        const answerDTO = new CreateAnswerDTO();
        answerDTO.totalScore = totalScore;
        answerDTO.samples = response;
        console.log(answerDTO);
        return answerDTO;
    }

}
