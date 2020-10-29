import React, {Component} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Point, SimplePoint} from '../Interfaces/BezierActionsInterface';
import {RootState} from '../Storage';
import {getBezierLinesPoints} from '../CommonFunctions/BezierFunctions';
import { X_OK } from 'constants';

const HEIGHT = 440;
const WIDTH = 440;

const YX_ANGLE = 120;
const YZ_ANGLE = 120;
const OFFSET = 10;

// Y
//    x
//Z
//
const drawBezierLines = (context: CanvasRenderingContext2D, pointsArray: Array<Array<Point>>) => {
  // context.beginPath();
  // 

  // context.setLineDash([]);
  // context.lineDashOffset = 0;

  // pointsArray.forEach( points => {
  //   points.map(converter).forEach( point => {
  //     context.beginPath();
  //     context.arc(point.x, point.y, 1, 0, Math.PI * 2, true);
  //     context.stroke();
  //   });
  // });

  // context.stroke();

  const pAcrossLenght = pointsArray.length-1;
  const pAlongLenght = pointsArray[0].length-1;
  // pointsArray.forEach((points) => {
  //   const arrayPointsToDraw = getBezierLinesPoints(points);

  //   arrayPointsToDraw.map(converter).reduce((pointA, pointB) => {
  //     context.moveTo(pointA.x, pointA.y);
  //     context.lineTo(pointB.x, pointB.y);

  //     return pointB;
  //   });
  // });

  context.beginPath();
  context.strokeStyle = '#000000';

  context.setLineDash([6]);
  context.lineDashOffset = 3;

  pointsArray.forEach( (points, i) => {
    points.map(converter).reduce( (pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);
     
      return pointB;
    });
  });

  pointsArray.reduce( (pointsA, pointsB) => {
    pointsA.map(converter).forEach( (pointA, i) => {
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
  context.fillStyle = "#e83737";
  let buff = converter(pointsArray[0][0]);
  context.fillText(`(0.0)`, buff.x-5, buff.y-15);

  buff = converter(pointsArray[pAcrossLenght][pAlongLenght]);
  context.fillText(`(${pAcrossLenght}.${pAlongLenght})`, buff.x, buff.y);

  buff = converter(pointsArray[0][pAlongLenght]);
  context.fillText(`(${0}.${pAlongLenght})`, buff.x, buff.y);

  buff = converter(pointsArray[pAcrossLenght][0]);
  context.fillText(`(${pAcrossLenght}.${0})`, buff.x, buff.y+5);

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

type State = {};

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
  result.y = HEIGHT - ( result.y - Math.cos(alf) * z + y);

  // z координата нас больше не волнует
  return result;
};

class CanvasClass extends Component<Props, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private backgroundCanRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: Props) {
    super(props);
    this.state = {};
    this.canvasRef = React.createRef();
    this.backgroundCanRef = React.createRef();
  }

  drawBezierGrid = () => {
    const context = this.canvasRef.current!.getContext('2d');
    const {points} = this.props;

    if (!context) return;

    const lastInd = points[0].length-1;
    
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

    const lineZ_1 = getBezierLinesPoints(points.map( p => p[0]));
    lineZ_1.map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    const lineZ_2 = getBezierLinesPoints(points.map( p => p[lastInd]));
    lineZ_2.map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    const lenght = Math.sqrt(Math.pow(points[0][0].x-points[0][lastInd].x, 2)+Math.pow(points[0][0].z-points[0][lastInd].z, 2));
    const numberOfLines = 10;

    const getPoint = (point_1: Point, point_2: Point, x: number, y:number, z: number): Point => {
      return {
        x: (x - point_1.x) / (point_2.x - point_1.x),
        y: (y - point_1.y) / (point_2.y - point_1.y),
        z: (z - point_1.z) / (point_2.z - point_1.z),
      }    
    };
 
    // // рисуем сетку вдоль оси Z
    for (let i = 0; i < numberOfLines; i++) {
      const ind = i*Math.floor(lineX_1.length/numberOfLines);
        
      const middlePoint_1 = getPoint

      const bLine = getBezierLinesPoints([
        lineX_1[ind],
        lineX_2[ind]
      ]).map(converter);


    }

    context.stroke();
  }

  componentDidMount() {
    const {points} = this.props;
    const context = this.canvasRef.current!.getContext('2d');
    const backgroundContext = this.backgroundCanRef!.current!.getContext('2d');


    DrawAxes(backgroundContext!);
    drawBezierLines(context!, points);
    this.drawBezierGrid();
  }

  componentDidUpdate = (prevProps: Props) => {
    const {points} = this.props;
    const context = this.canvasRef.current!.getContext('2d');

    context!.clearRect(0, 0, WIDTH, HEIGHT);

    if (points !== prevProps.points) {
      drawBezierLines(context!, points);
      this.drawBezierGrid();
    }
  };

  render() {
    return (
      <div className="D3_Canvas">
        <canvas className={'Canvas BackgroundCanvas'} width={WIDTH} height={HEIGHT} ref={this.backgroundCanRef} />
        <canvas className={'Canvas'} width={WIDTH} height={HEIGHT} ref={this.canvasRef} />
      </div>
    );
  }
}

export const D3_Canvas = connector(CanvasClass);
