import { Animal } from "./Animal";

export class Dog extends Animal {
    sound(): string {
        return "woof";
    }
    
}