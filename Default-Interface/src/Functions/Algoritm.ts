import {createExpressionStatement, createNamedExports} from 'typescript';
import {PolygonPoint, ScreenPoint} from '../Interfaces/PolygonPointsInterface';

// https://www.geeksforgeeks.org/weiler-atherton-polygon-clipping-algorithm/

type LineType = {
	point_1: ScreenPoint;
	point_2: ScreenPoint;
};

const X_OFFSET = 0.1;
const Y_OFFSET = 0.1;

// есть ли пересечение между линиями
const isLinesIntersected = (line_1: LineType, line_2: LineType): ScreenPoint | false => {
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
		x: +(line_2.point_1.x + (line_2.point_2.x - line_2.point_1.x) * n).toFixed(2),
		y: +(line_2.point_1.y + (line_2.point_2.y - line_2.point_1.y) * n).toFixed(2)
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
		return res;
	}
};

// находится ли точка внутри многоугольника или нет
// я не могу сказать какой из алгоритмов точнее
function inPoly(screenPoints: Array<ScreenPoint>, point: ScreenPoint) {
	let c = false;

	for (
		let i = 0, j = screenPoints.length - 1; 
		i < screenPoints.length; 
		j = i++
	) {
		if (
			((screenPoints[i].y <= point.y && point.y < screenPoints[j].y) ||
				(screenPoints[j].y <= point.y && point.y < screenPoints[i].y)) &&
			(point.x <
				((screenPoints[j].x - screenPoints[i].x) * (point.y - screenPoints[i].y)) /
					(screenPoints[j].y - screenPoints[i].y) + screenPoints[i].x)
		) {
			c = !c;
		}
	}
	return c;
}
const InsidePolygon = (screenPoints: Array<ScreenPoint>, point: ScreenPoint) => {
  let counter = 0;
  let i;
  let xinters;
  let p1 : ScreenPoint , p2 : ScreenPoint ;

  const MIN = (x: number,y:number) => (x < y ? x : y);
  const MAX = (x: number,y:number) => (x > y ? x : y);

  p1 = screenPoints[0];
  for (i=1;i<=screenPoints.length ;i++) {
    p2 = screenPoints[i % screenPoints.length];
    if (point.y > MIN(p1.y,p2.y)) {
      if (point.y <= MAX(p1.y,p2.y)) {
        if (point.x <= MAX(p1.x,p2.x)) {
          if (p1.y != p2.y) {
            xinters = (point.y-p1.y)*(p2.x-p1.x)/(p2.y-p1.y)+p1.x;
            if (p1.x == p2.x || point.x <= xinters)
              counter++;
          }
        }
      }
    }
    p1 = p2;
  }

  if (counter % 2 == 0)
    return false
  else
    return true;
}

console.log(inPoly([
	{x: 100, y: 150},
		{x: 270, y: 50},
		{x: 350, y: 150}], {x: 200, y: 150}
))

console.log(InsidePolygon([
	{x: 100, y: 150},
		{x: 270, y: 50},
		{x: 350, y: 150}], {x: 200, y: 150}
))


// порядок обхода важен !! от 1 к 2 !!!
const getNearPoint = (line: LineType, point: ScreenPoint): ScreenPoint => {
	const {
		point_1,
		point_2,
	} = line;

	if (point_2.x !== point_1.x) {
		// сдвигаемся чуть чуть ближе к точке 1
		const x = point_1.x < point_2.x ? point.x - 0.01 : point.x + 0.01;
		const buff = (x - point_1.x) / (point_2.x - point_1.x);

		return {
			x,
			y: buff * (point_2.y - point_1.y) + point_1.y,
		};
	} else {
		//с учетом, что ось y повернута вниз
		const y = point_1.y > point_2.y ? point.y + 0.01 : point.y - 0.01;
		const buff = (y - point_1.y) / (point_2.y - point_1.y);

		return {
			y,
			x: buff * (point_2.x - point_1.x) + point_1.x,
		};
	};
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
		const outPolyPoint = InsidePolygon.bind(null, screenPoints);

		// console.log( [...polygonPoints, polygonPoints[0]] );

		[...polygonPoints, polygonPoints[0]].reduce((pPointA, pPointB) => {
			const polygonLine: LineType = {
				point_1: pPointA,
				point_2: pPointB,
			};

			const buff: ListArrayType = [];
			let flag: boolean = true; // если эта точка пограничная и уже добавлена дважды в buff как вход и выход, то избегаем ее добавления 
			const pPointAKey = setKey(pPointA);

			[...screenPoints, screenPoints[0]].reduce((sPointA, sPointB) => {
				const screenLine: LineType = {
					point_1: sPointA,
					point_2: sPointB,
				};

				const point = isLinesIntersected(screenLine, polygonLine);
				// console.log(screenLine, polygonLine, point )
				if (point != false) {
					const pointKey = setKey(point);
					// console.log( point )
					if (pointKey === pPointAKey) {
						 flag = false;
					};

					// if (sPointB.x === point.x && sPointB.y === point.y) {
					// 	buff.push({
					// 		key: pointKey,
					// 		data: {point, type: pointType.entering} 
					// 	});
					// } else if (sPointA.x === point.x && sPointA.y === point.y) {
					// 	buff.push({
					// 		key: pointKey,
					// 		data: {point, type: pointType.leaving} 
					// 	});
					// } else 
					{
						// определяем это точка "вхождения" или "ухода" относительно screenPoints
						// console.log( polygonLine, point, getNearPoint(polygonLine, point) )
						if (!outPolyPoint(getNearPoint(polygonLine, point))) {
							buff.push({
								key: pointKey,
								data: {point, type: pointType.entering} 
							});
						} else {
							buff.push({
								key: pointKey,
								data: {point, type: pointType.leaving} 
							});
						};
					}
				};

				return sPointB;
			});

			buff.sort((pointA, pointB) => {
				const x_0 = pPointA.x;
				const y_0 = pPointA.y;

				const x_1 = pointA.data.point.x;
				const y_1 = pointA.data.point.y;

				const x_2 = pointB.data.point.x;
				const y_2 = pointB.data.point.y;

				const hypotenuse_1 = Math.sqrt(Math.pow(x_0 - x_1, 2) + Math.pow(y_0 - y_1, 2));
				const hypotenuse_2 = Math.sqrt(Math.pow(x_0 - x_2, 2) + Math.pow(y_0 - y_2, 2));

				return hypotenuse_1 - hypotenuse_2;
			});

			if (flag) {
				clippedPolygon.push({
					key: pPointAKey,
					data: {
						point: pPointA,
						type: pointType.none,
					},
				});
			}

			clippedPolygon.push(...buff);

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

		// console.log( startKey, buff );

		for (
			let i = buff.findIndex(({key, data}) => key === startKey && data.type === pointType.entering);
			i !== -1 && j !== 10;
			i = (i + 1) % buff.length, j++
		) {
	
			const {type, point} = buff[i].data;

			arr.push(point);
			if (type === pointType.leaving) {
				// console.log( arr )
				return arr;
			}
		}

		return arr;
	};
	// console.clear();

	console.log(clippedPolygon); 
	console.log(clippingPoligon);

	clippedPolygon.forEach(({key, data}) => {
		const {type} = data;

		if (type === pointType.entering) {
			const res: Array<ScreenPoint> = getPolygon(key, clippedPolygon);

			// console.log( res );
			// console.log('--------------------------')
			let toggleFlag = 1;
			while (setKey(res[res.length - 1]) !== key) {
				const newKey = setKey(res[res.length - 1]);
				// console.log('--------------------------')
				if (toggleFlag % 2) {
					res.push(...getPolygon(newKey, clippingPoligon));
				} else {
					res.push(...getPolygon(newKey, clippedPolygon));
				}
				// console.log( res )

				toggleFlag++;
				if (toggleFlag === 10) {
					console.log('!!!!!!!!!!!!!!!!!1');
	
					// явная ошибка
					return res;
				}
			}

			// res.pop();

			result.push(res);
		}
	});
	// console.log( result )
	return result;
};
