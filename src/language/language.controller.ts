import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateLanguageDTO } from "src/dto/create-language.dto";
import { LanguageService } from "./language.service";

@Controller("language")
export class LanguageController {
    constructor(private readonly languageService: LanguageService){};

    @Post()
    async create(@Body() createLanguageDTO: CreateLanguageDTO[]) {
        return this.languageService.create(createLanguageDTO);
    }

    @Get()
    async findAll(){
        return this.languageService.findAll();
    }
}