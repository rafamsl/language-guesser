import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import dotenv from "dotenv"
import {writeFile} from 'fs'
import { TextToSpeechClient } from "@google-cloud/text-to-speech"
import * as protos from "@google-cloud/text-to-speech/build/protos/protos"
import {promisify} from 'util';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();

const client = new TextToSpeechClient();

async function convertTextToMP3(){
  const request = {
    input: {text: "hello world"},
    voice: {
      languageCode: 'fr-FR',
      name: "fr-FR-Wavenet-A",
      ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
    },
    audioConfig: {
      audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
      sampleRateHertz: 8000,
    },
  };

  const [response] = await client.synthesizeSpeech(request);

  const file = promisify(writeFile);
  await file("output.mp3", response.audioContent, 'binary');

}
