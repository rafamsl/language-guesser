import { Body, Controller, Get, Header, Post, Render, Res } from '@nestjs/common';
import { SampleService } from './sample.service';
import { LanguageService } from 'src/language/language.service';

@Controller()
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

    @Get('language-guesser/play')
    @Render('samples')
    @Header('Cache-Control', 'no-cache') // Add this line to set cache-control header
    async createWikiRandom() {
    try {
        const result = await this.sampleService.getExtracts();
        const languages = this.languageService.findAll();
        return { result, languages };
    } catch (error) {
        console.error(error);
        return { error: 'Please refresh the page' };
    }
    }
}
