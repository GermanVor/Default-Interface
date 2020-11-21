import {createExpressionStatement, createNamedExports} from 'typescript';
import {PolygonPoint, ScreenPoint} from '../Interfaces/PolygonPointsInterface';

// https://www.geeksforgeeks.org/weiler-atherton-polygon-clipping-algorithm/

type line = {
	point_1: ScreenPoint;
	point_2: ScreenPoint;
};

const X_OFFSET = 0.1;
const Y_OFFSET = 0.1;

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
		// || (res.x === line_1.point_1.x && res.y === line_1.point_1.y) ||
		// (res.x === line_1.point_2.x && res.y === line_1.point_2.y) ||
		// (res.x === line_2.point_1.x && res.y === line_2.point_1.y) ||
		// (res.x === line_2.point_2.x && res.y === line_2.point_2.y)
	) {
		return false;
	} else {
		// console.log('Точка пересечения линий', line_1, line_2, 'равна', res);
		return res;
	}
};

// находится ли точка внутри многоугольника или нет
function inPoly(screenPoints: Array<ScreenPoint>, point: ScreenPoint) {
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
		const x = point_1.x < point_2.x ? point.x - 0.1 : point.x + 0.1;
		const buff = (x - point_1.x) / (point_2.x - point_1.x);

		return {
			x,
			y: buff * (point_2.y - point_1.y) + point_1.y,
		};
	} else {
		//с учетом, что ось y повернута вниз
		const y = point_1.y > point_2.y ? point.y + 0.1 : point.y - 0.1;
		const buff = (y - point_1.y) / (point_2.y - point_1.y);

		return {
			y,
			x: buff * (point_2.x - point_1.x) + point_1.x,
		};
	}
};

export type AlgoritmResult = Array<Array<ScreenPoint>>;

export const StartWeilerAthertonAlgoritm = (
	polygonPoints: Array<PolygonPoint>,
	screenPoints: Array<ScreenPoint>
): AlgoritmResult => {
	const pointType = <const>{
		entering: 'ENTERING',
		leaving: 'LEAVING',
		none: 'NONE',
	};

	type mapDataType = {
		point: ScreenPoint;
		type: typeof pointType.entering | typeof pointType.leaving | typeof pointType.none;
	};
	type ListArrayType = Array<{
		key: string;
		data: mapDataType;
	}>;

	const result: AlgoritmResult = [];

	// быстрые проверки на полное вхождение одного в другое

	const arr = [polygonPoints, screenPoints];

	let mainFlag = true;
	arr.forEach((points, i) => {
		if (mainFlag) {
			let flag = true;

			points.forEach((point) => {
				if (!inPoly(arr[(i + 1) % 2], point)) {
					flag = false;
				}
			});

			if (flag) {
				result.push(points);
				mainFlag = false;
			}
		}
	});

	if (!mainFlag) return result;

	const setKey = (point: ScreenPoint) => `${point.x}|${point.y}`;

	const BuildLists = (
		polygonPoints: Array<PolygonPoint>,
		screenPoints: Array<PolygonPoint>,
		isFirstTime: boolean = true
	): ListArrayType => {
		const clippedPolygon: ListArrayType = [];
		const inPolyPoint = inPoly.bind(null, screenPoints);

		[...polygonPoints, polygonPoints[0]].reduce((pPointA, pPointB) => {
			const polygonLine: line = {
				point_1: pPointA,
				point_2: pPointB,
			};

			const buff: Array<mapDataType> = [];

			[...screenPoints, screenPoints[0]].reduce((sPointA, sPointB) => {
				const screenLine: line = {
					point_1: sPointA,
					point_2: sPointB,
				};

				const point = isFirstTime
					? isLinesIntersected(polygonLine, screenLine)
					: isLinesIntersected(screenLine, polygonLine);
				// const point = isLinesIntersected(polygonLine, screenLine)

				if (point != false) {
					// определяем это точка "вхождения" или "ухода" относительно screenPoints

					if (!inPolyPoint(getNearPoint(pPointA, pPointB, point))) {
						buff.push({point, type: pointType.entering});
					} else {
						// console.log(pPointA, pPointB, point);
						buff.push({point, type: pointType.leaving});
					}
				}

				return sPointB;
			});

			buff.sort((pointA, pointB) => {
				const x_0 = pPointA.x;
				const y_0 = pPointA.y;

				const x_1 = pointA.point.x;
				const y_1 = pointA.point.y;

				const x_2 = pointB.point.x;
				const y_2 = pointB.point.y;

				const hypotenuse_1 = Math.sqrt(Math.pow(x_0 - x_1, 2) + Math.pow(y_0 - y_1, 2));
				const hypotenuse_2 = Math.sqrt(Math.pow(x_0 - x_2, 2) + Math.pow(y_0 - y_2, 2));

				return hypotenuse_1 - hypotenuse_2;
			});

			clippedPolygon.push({
				key: setKey(pPointA),
				data: {
					point: pPointA,
					type: pointType.none,
				},
			});

			clippedPolygon.push(
				...buff.map((data) => ({
					key: setKey(data.point),
					data,
				}))
			);

			return pPointB;
		});

		return clippedPolygon;
	};

	const clippedPolygon: ListArrayType = BuildLists(polygonPoints, screenPoints);
	const clippingPoligon: ListArrayType = BuildLists(screenPoints, polygonPoints, false);

	// возвращает кусок map от ["ENTERING", "LEAVING"]
	const getPolygon = (startKey: string, buff: ListArrayType): Array<ScreenPoint> => {
		const arr: Array<ScreenPoint> = [];

		let j = 0;
		for (
			let i = buff.findIndex(({key, data}) => key === startKey && data.type === pointType.entering);
			i !== -1 && j++ !== 10;
			i = (i + 1) % buff.length
		) {
			const {type, point} = buff[i].data;

			arr.push(point);
			if (type === pointType.leaving) {
				return arr;
			}
		}

		return arr;
	};

	clippedPolygon.forEach(({key, data}) => {
		const {type} = data;

		if (type === pointType.entering) {
			const res: Array<ScreenPoint> = getPolygon(key, clippedPolygon);

			let toggleFlag = 1;
			while (setKey(res[res.length - 1]) !== key) {
				const newKey = setKey(res.pop()!);

				if (toggleFlag % 2) {
					res.push(...getPolygon(newKey, clippingPoligon));
				} else {
					res.push(...getPolygon(newKey, clippedPolygon));
				}

				toggleFlag++;
				if (toggleFlag === 100) {
					console.log('!!!!!!!!!!!!!!!!!1');
					// явная ошибка
					return res;
				}
			}

			res.pop();

			result.push(res);
		}
	});

	return result;
};
