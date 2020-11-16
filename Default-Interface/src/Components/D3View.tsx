import React, {Component} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Point, SimplePoint} from '../Interfaces/BezierActionsInterface';
import {RootState} from '../Storage';
import {getBezierLinesPoints} from '../CommonFunctions/BezierFunctions';
import '../Style/D3_Canvas.css';

import {getBezierGrid} from '../CommonFunctions/BezierFunctions';

const HEIGHT = 640;
const WIDTH = 640;

const YX_ANGLE = 120;
const YZ_ANGLE = 120;
const OFFSET = 10;

const variation = [4, 12, 20]

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
      numberOfLines: variation[0]
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

    context.setLineDash([0]);
    context.lineDashOffset = 0;

    getBezierLinesPoints(points[0]).map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    getBezierLinesPoints(points[lastInd]).map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    getBezierLinesPoints(points.map((p) => p[0])).map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    getBezierLinesPoints(points.map((p) => p[lastInd])).map(converter).reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.y);
      context.lineTo(pointB.x, pointB.y);

      return pointB;
    });

    const a = getBezierGrid(points, numberOfLines, numberOfLines);

    a.map(arr => arr.map(converter).reduce( (pointA, pointB) => {
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);
  
        return pointB;
    }));

    a.reduce( (arrA, arrB) => {
      arrA.map(converter).forEach( (pointA, ind) => {
        const pointB = converter(arrB[ind]);

        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);
      });

      return arrB;
    });

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
    
    if (
      points !== prevProps.points || 
      numberOfLines !== prevState.numberOfLines
    ) {
      const context = this.canvasRef.current!.getContext('2d');
      context!.clearRect(0, 0, WIDTH, HEIGHT);

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
        {variation.map( el => {
          return <button key={`D3_Canvas-${el}`} onClick={() => this.setState({numberOfLines: el})}>{`${el}`}</button>
        })}
      </div>
    );
  }
}

export const D3Canvas = connector(CanvasClass);
