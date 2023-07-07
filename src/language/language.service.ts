import { Injectable } from '@nestjs/common';
import { Language } from 'src/interfaces/language/language.interface';
import { readFileSync } from 'fs';


@Injectable()
export class LanguageService {
    private readonly languages: Language[] = JSON.parse(readFileSync('src/language/language.json').toString());
    private readonly csvFilePath = 'src/language/language-matrix.csv';
    private similarity_matrix = "https://www.ezglot.com/language-similarity-matrix.html"

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

    
    // Function to get a value based on row and column
    async compareLanguages(language1: string, language2: string): Promise<number> {
      return new Promise((resolve, reject) => {
        const csvData = readFileSync(this.csvFilePath, 'utf8');
        const rows = csvData.split('\n').map((row) => row.split(','));
    
        const language1Index = rows.findIndex((row) => row[0] === language1);
        if (language1Index === -1) {
          reject(new Error(`Language "${language1}" not found.`));
        }
    
        const language2Index = rows.findIndex((row) => row[0] === language2);
        if (language2Index === -1) {
          reject(new Error(`Language "${language2}" not found.`));
        }
    
        const value = rows[language1Index][language2Index + 1];
        resolve(Number(value));
      });
    }
}
