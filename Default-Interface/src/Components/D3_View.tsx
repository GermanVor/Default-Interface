import React, {Component} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Point, SimplePoint} from '../Interfaces/BezierActionsInterface';
import {RootState} from '../Storage';
import {getBezierLinesPoints} from '../CommonFunctions/BezierFunctions';
import '../Style/D3_Canvas.css';

const HEIGHT = 640;
const WIDTH = 640;

const YX_ANGLE = 120;
const YZ_ANGLE = 120;
const OFFSET = 10;

// Y
//    x
//Z
//
const drawBezierLines = (context: CanvasRenderingContext2D, pointsArray: Array<Array<Point>>) => {
  const pAcrossLenght = pointsArray.length - 1;
  const pAlongLenght = pointsArray[0].length - 1;

  context.beginPath();
  context.strokeStyle = '#000000';

  context.setLineDash([6]);
  context.lineDashOffset = 3;

  pointsArray.forEach((points, i) => {
    points.map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });
  });

  pointsArray.reduce((pointsA, pointsB) => {
    pointsA.map(converter).forEach((pointA, i) => {
      const {x, y} = converter(pointsB[i]);

      context.moveTo(pointA.x, pointA.y);
      context.lineTo(x, y);
    });

    return pointsB;
  });

  context.stroke();

  context.beginPath();

  context.font = 'bold 12px sans-serif';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.fillStyle = '#e83737';
  let buff = converter(pointsArray[0][0]);
  context.fillText(`(0.0)`, buff.x - 5, buff.y - 15);

  buff = converter(pointsArray[pAcrossLenght][pAlongLenght]);
  context.fillText(`(${pAcrossLenght}.${pAlongLenght})`, buff.x, buff.y);

  buff = converter(pointsArray[0][pAlongLenght]);
  context.fillText(`(${0}.${pAlongLenght})`, buff.x, buff.y);

  buff = converter(pointsArray[pAcrossLenght][0]);
  context.fillText(`(${pAcrossLenght}.${0})`, buff.x, buff.y + 5);

  context.stroke();
};

const DrawAxes = (context: CanvasRenderingContext2D) => {
  let alf: number;
  const point = {x: 0, y: 0};
  context.beginPath();

  context.font = 'bold 12px sans-serif';
  context.strokeStyle = '#c98d8d';

  point.x = WIDTH / 2;
  point.y = OFFSET;
  context.moveTo(WIDTH / 2, HEIGHT / 2);
  context.lineTo(point.x, point.y);
  context.fillText('Y', point.x, point.y);

  alf = ((YX_ANGLE - 90) * Math.PI) / 180;
  point.x = WIDTH - OFFSET;
  point.y = HEIGHT / 2 + Math.tan(alf) * (WIDTH / 2 - OFFSET);
  context.moveTo(WIDTH / 2, HEIGHT / 2);
  context.lineTo(point.x, point.y);
  context.fillText('X', point.x, point.y);

  alf = ((YZ_ANGLE - 90) * Math.PI) / 180;
  point.x = OFFSET;
  point.y = HEIGHT / 2 + Math.tan(alf) * (WIDTH / 2 - OFFSET);
  context.moveTo(WIDTH / 2, HEIGHT / 2);
  context.lineTo(point.x, point.y);
  context.fillText('Z', point.x, point.y);

  context.stroke();
};

const mapState = (state: RootState) => {
  return {
    points: state.BezierReducer.points,
  };
};

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {
  numberOfLines: number;
};

type ownProps = {};

type Props = PropsFromRedux & ownProps;

const converter = (point: Point): SimplePoint => {
  const {x, y, z} = point;
  const result: Point = {x: 0, y: 0, z: 0};

  let alf = (-(YX_ANGLE - 90) * Math.PI) / 180;

  const x_0 = WIDTH / 2,
    y_0 = HEIGHT / 2;

  // экранировали на ось x
  result.x = (x + x_0 - x_0) * Math.cos(alf) - (0 + y_0 - y_0) * Math.sin(alf) + x_0;
  result.y = (x + x_0 - x_0) * Math.sin(alf) + (0 + y_0 - y_0) * Math.cos(alf) + y_0;

  alf = ((180 - YZ_ANGLE) * Math.PI) / 180;
  // сдвинули относительно z
  result.x = result.x - Math.sin(alf) * z;
  result.y = HEIGHT - (result.y - Math.cos(alf) * z + y);

  // z координата нас больше не волнует
  return result;
};

class CanvasClass extends Component<Props, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private backgroundCanRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      numberOfLines: 10,
    };
    this.canvasRef = React.createRef();
    this.backgroundCanRef = React.createRef();
  }

  drawBezierGrid = () => {
    const context = this.canvasRef.current!.getContext('2d');
    const {points} = this.props;
    const {numberOfLines} = this.state;

    if (!context) return;

    const lastInd = points[0].length - 1;

    context.beginPath();
    context.strokeStyle = '#000000';

    const lineX_1 = getBezierLinesPoints(points[0]);
    lineX_1.map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    const lineX_2 = getBezierLinesPoints(points[lastInd]);
    lineX_2.map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    const lineZ_1 = getBezierLinesPoints(points.map((p) => p[0]));
    lineZ_1.map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    const lineZ_2 = getBezierLinesPoints(points.map((p) => p[lastInd]));
    lineZ_2.map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    const getPoint_x = (point_1: Point, point_2: Point, x: number): Point => {
      const buff = (x - point_1.x) / (point_2.x - point_1.x);
      return {
        x,
        y: buff * (point_2.y - point_1.y) + point_1.y || point_1.y,
        z: buff * (point_2.z - point_1.z) + point_1.z || point_1.z,
      };
    };

    // вдоль оси Z
    const middleP_1_lenght_z = Math.sqrt(
      Math.pow(points[1][0].x - points[1][lastInd].x, 2) + Math.pow(points[1][0].z - points[1][lastInd].z, 2),
    );
    const middleP_2_lenght_z = Math.sqrt(
      Math.pow(points[2][0].x - points[2][lastInd].x, 2) + Math.pow(points[2][0].z - points[2][lastInd].z, 2),
    );

    // // рисуем сетку вдоль оси Z

    for (let i = 0; i < numberOfLines; i++) {
      const ind = Math.floor((i * lineX_1.length) / numberOfLines);

      const X_1 = points[1][0].x + (middleP_1_lenght_z / numberOfLines) * i;
      const middlePoint_1 = getPoint_x(
        [...points[1]].reverse().find(({x}) => x <= X_1)!,
        points[1].find(({x}) => x >= X_1) || points[1][lastInd],
        X_1,
      );

      const X_2 = points[2][0].x + (middleP_2_lenght_z / numberOfLines) * i;
      const middlePoint_2 = getPoint_x(
        [...points[2]].reverse().find(({x}) => x <= X_2) || points[0][lastInd],
        points[2].find(({x}) => x >= X_2) || points[2][lastInd],
        X_2,
      );

      const bLine = getBezierLinesPoints([lineX_1[ind], middlePoint_1, middlePoint_2, lineX_2[ind]]);

      bLine.map(converter).reduce((pointA, pointB) => {
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);

        return pointB;
      });
    }

    const getPoint_z = (point_1: Point, point_2: Point, z: number): Point => {
      const buff = (z - point_1.z) / (point_2.z - point_1.z);

      return {
        x: buff * (point_2.x - point_1.x) + point_1.x || point_1.x,
        y: buff * (point_2.y - point_1.y) + point_1.y || point_1.y,
        z,
      };
    };

    // вдоль оси X
    const middleP_1_lenght_x = Math.sqrt(
      Math.pow(points[0][1].x - points[lastInd][1].x, 2) + Math.pow(points[0][1].z - points[lastInd][1].z, 2),
    );
    const middleP_2_lenght_x = Math.sqrt(
      Math.pow(points[0][2].x - points[lastInd][2].x, 2) + Math.pow(points[0][2].z - points[lastInd][2].z, 2),
    );

    // // рисуем сетку вдоль оси X
    for (let i = 0; i < numberOfLines; i++) {
      const ind = Math.floor((i * lineZ_1.length) / numberOfLines);

      const Z_1 = points[0][1].z + (middleP_1_lenght_x / numberOfLines) * i;
      const middlePoint_1 = getPoint_z(
        points
          .map((arr) => arr[1])
          .reverse()
          .find((a) => a!.z <= Z_1) || points[0][1],
        points.map((arr) => arr[1]).find((a) => a!.z >= Z_1) || points[3][1],
        Z_1,
      );

      const Z_2 = points[0][2].z + (middleP_2_lenght_x / numberOfLines) * i;
      const middlePoint_2 = getPoint_z(
        points
          .map((arr) => arr[2])
          .reverse()
          .find((a) => a!.z <= Z_1) || points[0][2],
        points.map((arr) => arr[2]).find((a) => a!.z >= Z_2) || points[3][2],
        Z_2,
      );

      const bLine = getBezierLinesPoints([lineZ_1[ind], middlePoint_1, middlePoint_2, lineZ_2[ind]]);

      bLine.map(converter).reduce((pointA, pointB) => {
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);

        return pointB;
      });
    }

    context.stroke();
  };

  componentDidMount() {
    const {points} = this.props;
    const context = this.canvasRef.current!.getContext('2d');
    const backgroundContext = this.backgroundCanRef!.current!.getContext('2d');

    DrawAxes(backgroundContext!);
    drawBezierLines(context!, points);
    this.drawBezierGrid();
  }

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    const {numberOfLines} = this.state;
    const {points} = this.props;
    const context = this.canvasRef.current!.getContext('2d');

    context!.clearRect(0, 0, WIDTH, HEIGHT);

    if (points !== prevProps.points || numberOfLines !== prevState.numberOfLines) {
      drawBezierLines(context!, points);
      this.drawBezierGrid();
    }
  };

  render() {
    return (
      <div className="D3_Canvas">
        <div
          className={'Wrapper'}
          style={{
            width: WIDTH,
            height: HEIGHT,
          }}>
          <canvas className={'BackgroundCanvas'} width={WIDTH} height={HEIGHT} ref={this.backgroundCanRef} />
          <canvas className={'BackgroundCanvas'} width={WIDTH} height={HEIGHT} ref={this.canvasRef} />
        </div>
        <button onClick={() => this.setState({numberOfLines: 10})}>10</button>
        <button onClick={() => this.setState({numberOfLines: 60})}>60</button>
      </div>
    );
  }
}

export const D3_Canvas = connector(CanvasClass);
