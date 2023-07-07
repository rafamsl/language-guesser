import { Injectable } from '@nestjs/common';
import { CreateAnswerDTO } from 'src/dto/create-answer.dto';
import { SampleService } from 'src/sample/sample.service';
import { LanguageService } from 'src/language/language.service';


@Injectable()
export class AnswerService {
    
    constructor(private sampleService: SampleService, private languageService: LanguageService){};
    public filePath = 'src/language/language-matrix.csv';


    async getResult(formdata: any){
        const samples = this.sampleService.getDailySample().sample;
        const answerLanguages = formdata['language'];
        let totalScore = 0;
        const response = samples.map(async (obj,index)=>{
            const selectedLanguage = answerLanguages[index];
            const score = await this.languageService.compareLanguages(selectedLanguage,obj.language)
            return {...obj, selectedLanguage, score}
        })
        const answerDTO = new CreateAnswerDTO();
        answerDTO.totalScore = totalScore;
        answerDTO.samples = response;
        return answerDTO;
    }
}


