import { Recipe } from "./recipe";

export class Food{
    id?: string;
    title: string;
    description?: string;
    owner: string;
    subscriber?: string[];
    category?: string[];
    recipe?: Recipe;
}