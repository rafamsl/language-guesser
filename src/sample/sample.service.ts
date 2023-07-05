import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { readFileSync, writeFile, writeFileSync } from 'fs';
import { CreateSampleDTO } from 'src/dto/create-sample.dto';
import { DailySample } from 'src/interfaces/daily-sample/daily-sample.interface';
import { Sample } from 'src/interfaces/sample/sample.interface';
import { LanguageService } from 'src/language/language.service';
import { format } from 'date-fns';
import { CreateDailySampleDTO } from 'src/dto/create-dailySampleDTO.dto';
import { protos, TextToSpeechClient } from '@google-cloud/text-to-speech';
import { promisify } from 'util';
import { config } from 'dotenv';
config();

@Injectable()
export class SampleService {
    // private readonly samples: Sample[] = [];

    constructor(private languageService: LanguageService){};
    public samples: Sample[] = [];

    checkAnswer(languages: Array<string>): Boolean {
        return languages[0] === languages[1];
    }

    async getRandomPage(code: string){
        const url = `https://${code}.wikipedia.org/w/api.php`;
        const params = {
            action: 'query',
            format: 'json',
            generator: 'random',
            grnnamespace: 0,
            prop: 'extracts',
            exintro: true,
            explaintext: true,
            exsentences: 50,  // adjust this to get about 100 words
            exlimit: 'max',
            grnlimit: 1
          };
        const response = await axios.get(url, { params });
        return response.data;
    }

    async extractData(data: any, language: string, code: string, index: number) {
        for (let pageId in data.query.pages) {
          const extract = data.query.pages[pageId].extract;
          if (extract) {
            const createSampleDTO: CreateSampleDTO = {
              extract: extract,
              language: language,
              code: code,
              id: index
            };
            this.samples.push(createSampleDTO);
            await this.convertTextToMP3(extract,code,index);
          }
        }
      }

    async getExtracts() {
        // Check if daily samples were created
        let dailySample = this.getDailySample();
        if(dailySample.date === this.getFormattedDate()){
          return dailySample.sample;
        }

        // Create Daily sample
        return await this.createDailySamples(dailySample);
    }

    getFormattedDate(): string {
      const date = new Date();
      const formattedDate = format(date, 'dd/MM/yy');
      return formattedDate;
    }

    writeDailySampleToFile(dailySample: DailySample): void {
      const filePath = 'src/sample/dailySample.json';
      const jsonContent = JSON.stringify(dailySample, null, 2);
      writeFileSync(filePath, jsonContent);
    }

    getDailySample() : DailySample{
      return JSON.parse(readFileSync('src/sample/dailySample.json').toString());
    }

    async createDailySamples(dailySample: DailySample){
      // Clean sample memory
      this.samples = [];

      // Get languages
      const randomLanguages = this.languageService.getRandom(5);

      // Iterate over each language
      let index = 0;
      for (let language of randomLanguages) {
        const data = await this.getRandomPage(language.code);
        this.extractData(data, language.name, language.code, index);
        index++;
      }

      // Create DailySample DTO and save it

      dailySample = new CreateDailySampleDTO();
      dailySample.date = this.getFormattedDate();
      dailySample.sample = this.samples;
      this.writeDailySampleToFile(dailySample);
      
      return dailySample.sample;
    }

    async convertTextToMP3(text:string, languageCode: string, index: number){

      const googleClient = new TextToSpeechClient({
        credentials: {
          client_email: process.env.CLIENT_EMAIL,
          private_key: process.env.PRIVATE_KEY
        },
      });

      const request = {
        input: {text: text},
        voice: {
          languageCode: languageCode,
          ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
        },
        audioConfig: {
          audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
        }
      };
    
      const [response] = await googleClient.synthesizeSpeech(request);
      const file = promisify(writeFile);
      await file("/language-guesser/public/audio/" + index + ".mp3", response.audioContent, 'binary');
    
    }


}
