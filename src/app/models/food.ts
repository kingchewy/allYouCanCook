import { Category } from "./category";
import { Recipie } from "./recipie";

export class Food{
    id?: string;
    title: string;
    owner: string;
    subscriber?: String[];
    category?: Category[];
    recipie?: Recipie
}