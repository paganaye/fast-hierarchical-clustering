import { ClassicAvgAlgorithm } from './avg/ClassicAvgAlgorithm';
import { NewAvgAlgorithm } from './avg/NewAvgAlgorithm';
import { IAlgorithm } from './workers/IAlgorithm';
import { Point } from './Point';
import { AlgorithmRunner } from './AlgorithmRunner';
import { IPoint } from './IPoint';
import { IPointsWorkerInput } from './workers/PointsWorker';

export class App {
    points: Point[] = [];
    dotSize = 3;
    algorithm!: IAlgorithm;
    numberOfPoints: number = 0;
    wantedClusters: number = 0;
    linkage: string = "";
    canvasSize: number = 0;
    classicAlgorithmRunner: AlgorithmRunner = new AlgorithmRunner(this, "canvas1", "output1", "run1", false);
    newAlgorithmRunner: AlgorithmRunner = new AlgorithmRunner(this, "canvas2", "output2", "run2", true)
    pointsWorker: Worker = new Worker('./src/workers/PointsWorker.js', { type: "module" });
    selectNumberOfPoints!: HTMLSelectElement;

    addHandler(name: string, expectsInteger: boolean, onChange: (v: any) => void): HTMLSelectElement {
        let select = document.getElementById(name)! as HTMLSelectElement;
        let queryParams = new URLSearchParams(window.location.search);
        let value = queryParams.get(name);
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value == value) {
                select.options[i].selected = true;
            }
        }
        let onChangeFn = () => {
            onChange(expectsInteger ? parseInt(select.value) : select.value);
        }
        select.onchange = onChangeFn;
        setTimeout(onChangeFn, 0);
        return select;
    }



    init() {
        this.selectNumberOfPoints = this.addHandler("numberOfPoints", true, (v) => {
            this.numberOfPoints = v;
            this.updateQueryString();
            this.selectNumberOfPoints.disabled = true;
            let args: IPointsWorkerInput = {
                numberOfPoints: this.numberOfPoints
            };
            this.pointsWorker.postMessage(args);
            this.updateQueryString();
            });
        this.addHandler("wantedClusters", true, (v) => {
            this.wantedClusters = v;
            this.updateQueryString();
            this.onAlgorithmArgsChanged();
        });
        this.addHandler("linkage", true, (v) => {
            this.linkage = v;
            this.updateQueryString();
            this.onAlgorithmArgsChanged();
        });
        this.addHandler("canvasSize", true, (v) => {
            this.canvasSize = v;
            this.updateQueryString();
            this.classicAlgorithmRunner.onCanvasSizeChanged();
            this.newAlgorithmRunner.onCanvasSizeChanged();
        });

        this.pointsWorker.onmessage = (v) => {
            this.selectNumberOfPoints.disabled = false;
            this.points = v.data.points as Point[];
            this.classicAlgorithmRunner.onPointsChanged();
            this.newAlgorithmRunner.onPointsChanged();
        };

    }


    onAlgorithmArgsChanged() {
        this.updateQueryString();
        this.classicAlgorithmRunner.onAlgorithmArgsChanged();
        this.newAlgorithmRunner.onAlgorithmArgsChanged();
    }

    updateQueryString() {
        var queryParams = new URLSearchParams(window.location.search);
        queryParams.set("numberOfPoints", this.numberOfPoints.toString());
        queryParams.set("wantedClusters", this.wantedClusters.toString());
        queryParams.set("linkage", this.linkage);
        queryParams.set("canvasSize", this.canvasSize.toString());
        // Replace current querystring with the new one.
        history.replaceState(null, "", "?" + queryParams.toString());
    }

    //     this.classicAlgorithmRunner.init(classicAlgorithmConstructor);
    //     this.newAlgorithmRunner.init(newAlgorithmConstructor);

}

