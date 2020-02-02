import { Point } from "./Point";

export interface Dendrogram extends Point {
    children?: Array<Dendrogram>;
}

