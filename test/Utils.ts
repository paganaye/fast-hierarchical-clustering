import { ClassicAvgAlgorithm } from '../src/classic/ClassicAvgAlgorithm';
import { Cluster } from '../src/Cluster';
import { Point } from '../src/Point';
import { IAlgorithm } from '../src/workers/IAlgorithm';
import { AlgorithmType, instantiateAlgorithm } from '../src/workers/AlgorithmType';
import { expect } from 'chai';
import { PseudoRandom } from '../src/PseudoRandom';


// https://gist.github.com/blixt/f17b47c62508be59987b
// The generation of random numbers is too important to be left to chance - Robert R. Coveyou

export function getNormalizedDendrogram(algorithm: IAlgorithm, withDistances: boolean = false): string {
    let generator = algorithm.forEachClusters();
    let x: IteratorResult<Cluster, any>
    let dendrogramCount: number;
    do {
        x = generator.next()
        dendrogramCount = algorithm.getDendrogramsCount();
    } while (!x.done && dendrogramCount > 1)

    let dendrograms = algorithm.getCurrentDendrograms();
    return dendrograms.map(d => d.getNormalizedDendrogram(withDistances)).join(" ")
}

export function runThousandTrios(algorithmType: AlgorithmType) {
    runSeveralTest({ algorithmType, nbPoints: 3, nbTest: 1000, name: "trio" });

}

export function runThousandQuartets(algorithmType: AlgorithmType) {
    runSeveralTest({ algorithmType, nbPoints: 4, nbTest: 1000, name: "quartet" });
}

export function runThousandQuintets(algorithmType: AlgorithmType) {
    runSeveralTest({ algorithmType, nbPoints: 5, nbTest: 1000, name: "quintet" });
}

export function runThousandDozen(algorithmType: AlgorithmType) {
    runSeveralTest({ algorithmType, nbPoints: 12, nbTest: 1000, name: "dozen" });
}

export function runSeveralTest(_: { algorithmType: number, nbPoints: number, nbTest: number, name: string }) {
    PseudoRandom._seed = 1122333;
    for (let i = 1; i < _.nbTest; i++) {
        expectSameResultThanClassic(_);
    }
}


export function expectSameResultThanClassic(_: { algorithmType: number, nbPoints: number, name: string }) {
    let seed = PseudoRandom._seed;
    let points: Point[] = [];
    let ascii_A = "A".charCodeAt(0);
    for (let i = 0; i < _.nbPoints; i++) {
        points.push(Point.randomPoint(String.fromCharCode(ascii_A + i)));
    }
    let classicAlgorithm = new ClassicAvgAlgorithm(points);
    let otherAlgorithm = instantiateAlgorithm(_.algorithmType, points);

    if (!otherAlgorithm) {
        console.log("Invalid algorithm");
        return;
    }
    let classicAlgorithmResult = getNormalizedDendrogram(classicAlgorithm, true);
    let otherAlgorithmResult = getNormalizedDendrogram(otherAlgorithm, true);

    if (otherAlgorithmResult != classicAlgorithmResult) {
        console.log(`it('${_.name} ${seed.toString(16)} ${AlgorithmType[_.algorithmType]}', function () {`)
        for (let i = 0; i < _.nbPoints; i++) {
            let point = points[i];
            let distanceString: string[] = [];
            for (let i2 = 0; i2 < _.nbPoints; i2++) {
                if (i2 == i) {
                    distanceString.push(`        `)
                } else {
                    let point2 = points[i2];
                    let distance = point.distanceTo(point2);
                    distanceString.push(`${point.tag}${point2.tag} ${distance.toFixed(3)}`);
                }
            }
            console.log(`  let ${point.tag} = new Point(${point.x.toFixed(4)}, ${point.y.toFixed(4)}, "${point.tag}"); // ${distanceString.join(' ')}`)
        }
        console.log(`  let algorithmResult = getNormalizedDendrogram(new ${otherAlgorithm.className}([${points.map(it => it.tag)}]), true);`)
        console.log(`  expect(algorithmResult).to.eq("${classicAlgorithmResult}"); // and not ${otherAlgorithmResult}`);
        console.log(`});`)
        console.log({ classicAlgorithm })
    }
    expect(classicAlgorithmResult).to.eq(otherAlgorithmResult);
}
