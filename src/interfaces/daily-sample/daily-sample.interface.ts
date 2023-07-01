import { Sample } from "../sample/sample.interface";

export interface DailySample {
    sample: Sample[];
    date: string;
}
