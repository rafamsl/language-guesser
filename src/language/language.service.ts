import { Injectable } from '@nestjs/common';
import { Language } from 'src/interfaces/language/language.interface';
import { readFileSync } from 'fs';

@Injectable()
export class LanguageService {
    private readonly languages: Language[] = JSON.parse(readFileSync('src/language/language.json').toString());

    create(languages:Language[]) {
        this.languages.push(...languages);
        return `This action adds ${languages.length} new language(s)`;
    }

    getRandom(X: number): Language[] {
        const randomLanguages: Language[] = [];
        const usedIndices: number[] = []; // Keep track of used indices
        while (randomLanguages.length < X && usedIndices.length < this.languages.length) {
          const randomIndex = Math.floor(Math.random() * this.languages.length);
          if (!usedIndices.includes(randomIndex)) { // Check if index has been used before
            usedIndices.push(randomIndex);
            randomLanguages.push(this.languages[randomIndex]);
          }
        }
        return randomLanguages;
    }

    findAll(): Language[]{
        return this.languages;
    }
}
