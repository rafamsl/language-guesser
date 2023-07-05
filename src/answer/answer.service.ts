import { Injectable } from '@nestjs/common';
import { CreateAnswerDTO } from 'src/dto/create-answer.dto';
import { SampleService } from 'src/sample/sample.service';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

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
        return answerDTO;
    }

    async compareLanguages(language1: string, language2: string): Promise<number> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        // Go to the comparison website.
        await page.goto('http://www.elinguistics.net/Compare_Languages.aspx', { waitUntil: 'networkidle2' });
    
        // Insert the languages into the input fields.
        await page.select('#LanguageList1', language1);
        await page.select('#LanguageList2', language2);
        
        // Submit the form.
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          page.click('#Submit1'), // Assuming the compare button has id 'compare_button'
        ]);
    
        // Scrape the result.
        const similarityScore = await page.evaluate(() => {
            const lineElement = document.querySelector('line'); // Adjust this selector to target the correct <line> element
            return parseFloat(lineElement.getAttribute('x1'));
          });
    
        await browser.close();
    
        return similarityScore;
      }

}


