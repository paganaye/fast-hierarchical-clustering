import { ClassicAvgAlgorithm } from './avg/ClassicAvgAlgorithm';
import { NewAvgAlgorithm } from './avg/NewAvgAlgorithm';
import { IAlgorithm } from './IAlgorithm';
import { Point } from './Point';
import { Points } from './Points';
import { AlgorithmRunner } from './AlgorithmRunner';

export class App {
    points: Point[] = [];
    palette: string[] = [];
    dotSize = 3;
    algorithm!: IAlgorithm;
    numberOfPoints!: number;
    wantedCluters!: number;
    linkage!: string;
    canvasSize!: number;
    classicAlgorithmRunner: AlgorithmRunner = new AlgorithmRunner(this, "canvas1", "output1", "run1");
    newAlgorithmRunner: AlgorithmRunner = new AlgorithmRunner(this, "canvas2", "output2", "run2")

    getValue(name: string, init: boolean, isNumber: boolean): any {
        let select = document.getElementById(name)! as HTMLSelectElement;
        if (init) {
            let queryParams = new URLSearchParams(window.location.search);
            let value = queryParams.get(name);
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value == value) {
                    select.options[i].selected = true;
                }
            }
        }
        if (!select.onchange) {
            select.onchange = () => { this.refresh() };
        }
        let result = select.value;
        return isNumber ? parseInt(result) : result;
    }

    refresh(init: boolean = false) {
        this.numberOfPoints = this.getValue("numberOfPoints", init, true)
        this.wantedCluters = this.getValue("wantedClusters", init, true);
        this.linkage = "avg"; // this.getValue("linkage", init, false);        
        this.canvasSize = this.getValue("canvasSize", init, true);

        let classicAlgorithmConstructor!: () => IAlgorithm;
        let newAlgorithmConstructor!: () => IAlgorithm;

        if (this.points.length != this.numberOfPoints) {
            this.points = [];
            let groupBy = Math.round(1 + Math.sqrt(this.numberOfPoints));
            // we group points to make more interesting patterns than just plain random
            for (let i = 0; i < this.numberOfPoints / groupBy; i++) {
                let point0 = Point.randomPoint();
                Points.addRandomPointsAround(this.points, groupBy, point0, 0.05);
            }
        }


        switch (this.linkage) {
            case "avg":
                classicAlgorithmConstructor = () => new ClassicAvgAlgorithm();
                newAlgorithmConstructor = () => new NewAvgAlgorithm();
                break;
        }

        this.classicAlgorithmRunner.init(classicAlgorithmConstructor);
        this.newAlgorithmRunner.init(newAlgorithmConstructor);

        var queryParams = new URLSearchParams(window.location.search);

        this.palette = [];
        for (let i = 0; i < this.wantedCluters; i++) {
            this.palette.push(getColorPalette(i * 16807 % this.wantedCluters, this.wantedCluters));
        }
        this.dotSize = Math.max(1, 3 - this.numberOfPoints / 1000);


        // Set new or modify existing parameter value. 
        queryParams.set("numberOfPoints", this.numberOfPoints.toString());
        queryParams.set("wantedClusters", this.wantedCluters.toString());
        queryParams.set("linkage", this.linkage);
        queryParams.set("canvasSize", this.canvasSize.toString());

        // Replace current querystring with the new one.
        history.replaceState(null, "", "?" + queryParams.toString());
    }

}

function getColorPalette(colorNo: number, colorCount: number) {
    return hsv2rgb(colorNo * 360 / colorCount, 1, 1);
}

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
function hsv2rgb(h: number, s: number, v: number) {
    let f = (n: number, k = (n + h / 60) % 6) => 255 * (v - v * s * Math.max(Math.min(k, 4 - k, 1), 0));
    return `rgb(${f(5)},${f(3)},${f(1)})`;
}

var app = new App();
setTimeout(() => app.refresh(true), 0);
