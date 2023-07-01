import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { Sample } from 'src/interfaces/sample/sample.interface';
import { SampleService } from './sample.service';
import { CreateSampleDTO } from 'src/dto/create-sample.dto';
import { getDefaultResultOrder } from 'dns';
import { CreateAnswerDTO } from 'src/dto/create-answer.dto';
import { LanguageService } from 'src/language/language.service';

@Controller('sample')
export class SampleController {
    constructor(private readonly sampleService: SampleService, private readonly languageService: LanguageService){};

    // @Post()
    // async create(@Body() createSampleDTO: CreateSampleDTO[]) {
    //     return this.sampleService.create(createSampleDTO);
    // }

    // @Get()
    // async findAll(): Promise<Sample[]> {
    //     return this.sampleService.findAll();
    // }

    @Get('wikiRandom')
    @Render('samples')
    async createWikiRandom() {
        try {
            const result = await this.sampleService.getExtracts();
            const languages = this.languageService.findAll();
            console.log(languages);
            return { result, languages };
        } catch (error) {
            console.error(error);
            return { error: 'Please refresh the page' };
        }
    }

    @Get('audio')
    async getTextToAudio(){
        await this.sampleService.convertTextToMP3("To chegando com os refri rapaziada", "pt", 1);
        return;
    }
}
