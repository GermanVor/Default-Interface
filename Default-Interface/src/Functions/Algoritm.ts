import {PolygonPoint, ScreenPoint} from '../Interfaces/PolygonPointsInterface';

// https://www.geeksforgeeks.org/weiler-atherton-polygon-clipping-algorithm/

type line = {
    point_1: ScreenPoint;
    point_2: ScreenPoint;
};

// есть ли пересечение между линиями
const isLinesIntersected = (line_1: line, line_2: line): ScreenPoint | false => {
    let n: number;

    if (line_1.point_2.y - line_1.point_1.y != 0) {
        const q = (line_1.point_2.x - line_1.point_1.x) / (line_1.point_1.y - line_1.point_2.y);
        const sn = line_2.point_1.x - line_2.point_2.x + (line_2.point_1.y - line_2.point_2.y) * q;

        if (!sn) {
            return false;
        }

        const fn = line_2.point_1.x - line_1.point_1.x + (line_2.point_1.y - line_1.point_1.y) * q;
        n = fn / sn;
    } else {
        if (!(line_2.point_1.y - line_2.point_2.y)) {
            return false;
        }

        n = (line_2.point_1.y - line_1.point_1.y) / (line_2.point_1.y - line_2.point_2.y);
    }

    const res = {
        x: line_2.point_1.x + (line_2.point_2.x - line_2.point_1.x) * n,
        y: line_2.point_1.y + (line_2.point_2.y - line_2.point_1.y) * n,
    };

    // проверяем находится ли точка пересечения на самих прямых или на их продолжении
    if (
        (line_1.point_1.x < res.x && line_1.point_2.x < res.x) ||
        (line_1.point_1.x > res.x && line_1.point_2.x > res.x) ||
        (line_2.point_1.x < res.x && line_2.point_2.x < res.x) ||
        (line_2.point_1.x > res.x && line_2.point_2.x > res.x) ||
        (line_1.point_1.y < res.y && line_1.point_2.y < res.y) ||
        (line_1.point_1.y > res.y && line_1.point_2.y > res.y) ||
        (line_2.point_1.y < res.y && line_2.point_2.y < res.y) ||
        (line_2.point_1.y > res.y && line_2.point_2.y > res.y)
    ) {
        return false;
    } else {
        // console.log('Точка пересечения линий', line_1, line_2, 'равна', res);
        return res;
    }
};

// находится ли точка внутри многоугольника или нет
export function inPoly(screenPoints: Array<ScreenPoint>, point: ScreenPoint) {
    let j = screenPoints.length - 1;
    let c = false;
    for (let i = 0; i < screenPoints.length; i++) {
        if (
            ((screenPoints[i].y <= point.y && point.y < screenPoints[j].y) ||
                (screenPoints[j].y <= point.y && point.y < screenPoints[i].y)) &&
            point.x >
                ((screenPoints[j].x - screenPoints[i].x) * (point.y - screenPoints[i].y)) /
                    (screenPoints[j].y - screenPoints[i].y) +
                    screenPoints[i].x
        ) {
            c = !c;
        }
        j = i;
    }
    return c;
}

// порядок обхода важен !! от 1 к 2 !!!
const getNearPoint = (point_1: ScreenPoint, point_2: ScreenPoint, point: ScreenPoint): ScreenPoint => {
    if (point_2.x !== point_1.x) {
        // сдвигаемся чуть чуть ближе к точке 1
        const x = point_1.x > point_2.x ? point.x + 0.1 : point.x - 0.1;
        const buff = (x - point_1.x) / (point_2.x - point_1.x);

        return {
            x,
            y: buff * (point_2.y - point_1.y) + point_1.y,
        };
    } else {
        //с учетом, что осб y повернута вниз
        const y = point_1.y > point_2.y ? point.y + 0.1 : point.y - 0.1;
        const buff = (y - point_1.y) / (point_2.y - point_1.y);

        return {
            y,
            x: buff * (point_2.x - point_1.x) + point_1.x,
        };
    }
};

export const StartWeilerAthertonAlgoritm = (polygonPoints: Array<PolygonPoint>, screenPoints: Array<ScreenPoint>) => {
    const inPolyPoint = inPoly.bind(null, screenPoints);
    // нужно добавить проверку, возможно все вершины входят в окно

    const clippingPoligon: Array<ScreenPoint> = [];
    const clippedPolygon: Array<ScreenPoint> = [];

    // хранит в себе индесы "вхождений" из массива clippedPolygon
    // "часть алгоритма"
    const enteringPointsIndexMap: Array<number> = [];

    // хранит в себе индексы "уходов" из массивов clippedPolygon
    // "часть алгоритма"
    //
    // по хорошему должен хранить ссылку на нужный элемент из clippingPoligon,
    // но пока не придумал как идентифицировать точки, кроме как по координатам, поэтому придется искать по ним в массиве,
    // если будет работать плавно, то так и оставлю
    const leavingPointsIndexMap: Array<number> = [];

    // мутирующая функция !
    const BuildLists = () => {
        // нужно утрамбовать это в функцию и вызвать ее дважды
        [...polygonPoints, polygonPoints[0]].reduce((pPointA, pPointB) => {
            const polygonLine: line = {
                point_1: pPointA,
                point_2: pPointB,
            };

            clippedPolygon.push(pPointA);

            [...screenPoints, screenPoints[0]].reduce((sPointA, sPointB) => {
                const screenLine: line = {
                    point_1: sPointA,
                    point_2: sPointB,
                };

                const point = isLinesIntersected(polygonLine, screenLine);

                if (point != false) {
                    const ind = clippedPolygon.push(point) - 1;
                    // определяем это точка "вхождения" или "ухода"

                    if (!inPolyPoint(getNearPoint(pPointA, pPointB, point))) {
                        enteringPointsIndexMap.push(ind);
                    } else {
                        leavingPointsIndexMap.push(ind);
                    }
                }

                return sPointB;
            });

            return pPointB;
        });

        [...screenPoints, screenPoints[0]].reduce((sPointA, sPointB) => {
            const screenLine: line = {
                point_1: sPointA,
                point_2: sPointB,
            };

            clippingPoligon.push(sPointA);

            [...polygonPoints, polygonPoints[0]].reduce((pPointA, pPointB) => {
                const polygonLine: line = {
                    point_1: pPointA,
                    point_2: pPointB,
                };

                const point = isLinesIntersected(polygonLine, screenLine);

                if (point !== false) {
                    clippingPoligon.push(point);
                }

                return pPointB;
            });

            return sPointB;
        });
    };

    BuildLists();
};
