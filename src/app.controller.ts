import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    @Get('language-guesser')
    @Render('index')
    async home(){
        return;
    }
}
