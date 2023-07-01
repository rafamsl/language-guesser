import { Sample } from "src/interfaces/sample/sample.interface";

export class CreateDailySampleDTO {
    sample: Sample[];

    date: string;
}