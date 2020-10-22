import React, {Component} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {D3_Point} from '../Interfaces/CanvasInterface';
import {RootState} from '../Storage';
import {addPoint} from '../Storage/Actions/CanvasActions';
import {Point} from '../Interfaces/CanvasInterface';
import {isConnection, getGeneralIndex} from '../Storage/CanvasReducer';
import '../Style/Canvas.css';

const HEIGHT = 440;
const WIDTH = 440;
const OFFSET = 10;

const YX_ANGLE = 120;
const YZ_ANGLE = 120;

const mapState = (state: RootState) => {
  return {
    isRecording: state.ServiceReducer.isRecording,
    points: state.CanvasReducer.points,
    isConnection: isConnection.bind(null, state.CanvasReducer),
  };
};

const mapDispatch = {
  addPoint,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {};

type ownProps = {
  axes: {
    firstAxisName: string;
    secondAxisName: string;
    thirdAxisName: string;
  };
};
type Props = PropsFromRedux & ownProps;

const DrawAxes = (
  context: CanvasRenderingContext2D,
  firstAxisName: string,
  secondAxisName: string,
  thirdAxisName: string,
) => {
  let alf: number;
  const point = {x: 0, y: 0};

  context.font = 'bold 14px sans-serif';
  context.strokeStyle = '#000000';

  point.x = WIDTH / 2;
  point.y = OFFSET;
  context.moveTo(WIDTH / 2, HEIGHT / 2);
  context.lineTo(point.x, point.y);
  context.fillText(firstAxisName, point.x, point.y);

  alf = ((YX_ANGLE - 90) * Math.PI) / 180;
  point.x = WIDTH - OFFSET;
  point.y = HEIGHT / 2 + Math.tan(alf) * (WIDTH / 2 - OFFSET);
  context.moveTo(WIDTH / 2, HEIGHT / 2);
  context.lineTo(point.x, point.y);
  context.fillText(secondAxisName, point.x, point.y);

  alf = ((YZ_ANGLE - 90) * Math.PI) / 180;
  point.x = OFFSET;
  point.y = HEIGHT / 2 + Math.tan(alf) * (WIDTH / 2 - OFFSET);
  context.moveTo(WIDTH / 2, HEIGHT / 2);
  context.lineTo(point.x, point.y);
  context.fillText(thirdAxisName, point.x, point.y);

  context.stroke();
};

const converter = (D3_point: D3_Point): Point => {
  const {x, y, z} = D3_point;
  const result: Point = {
    first: 0,
    second: 0,
  };

  let alf = (-(YX_ANGLE - 90) * Math.PI) / 180;

  const x_0 = WIDTH / 2,
    y_0 = HEIGHT / 2;

  // экранировали на ось x
  result.first = (x + x_0 - x_0) * Math.cos(alf) - (0 + y_0 - y_0) * Math.sin(alf) + x_0;
  result.second = (x + x_0 - x_0) * Math.sin(alf) + (0 + y_0 - y_0) * Math.cos(alf) + y_0;

  alf = ((180 - YZ_ANGLE) * Math.PI) / 180;
  // сдвинули относительно z
  result.first = result.first - Math.sin(alf) * z;
  result.second = result.second - Math.cos(alf) * z + y;

  return result;
};

const drawPoint = (context: CanvasRenderingContext2D, D3_point: D3_Point, ind: number) => {
  const {first, second} = converter(D3_point);
  context.fillStyle = '#302020';

  context.beginPath();
  context.arc(Math.floor(first), Math.floor(HEIGHT - second), 2, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();

  context.font = 'bold 12px sans-serif';
  context.textBaseline = 'top';

  context.fillStyle = '#a30e0e';
  context.fillText(
    `x:${D3_point.x}, y:${D3_point.y}, z:${D3_point.z}`,
    Math.floor(first),
    Math.floor(HEIGHT - second + 5),
  );
  context.fillText(`${String.fromCharCode(65 + ind)}`, Math.floor(first), Math.floor(HEIGHT - second - 15));
};

const drawConnection = (context: CanvasRenderingContext2D, a: D3_Point, b: D3_Point) => {
  const firstTop = converter(a);
  const secondTop = converter(b);

  context.setLineDash([4, 16]);
  context.beginPath();
  context.moveTo(Math.floor(firstTop.first), Math.floor(HEIGHT - firstTop.second));
  context.lineTo(Math.floor(secondTop.first), Math.floor(HEIGHT - secondTop.second));
  context.stroke();
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

  componentDidMount() {
    const backgroundContext = this.backgroundCanRef!.current!.getContext('2d');
    const {firstAxisName, secondAxisName, thirdAxisName} = this.props.axes;

    DrawAxes(backgroundContext!, firstAxisName, secondAxisName, thirdAxisName);
  }

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    const context = this.canvasRef.current!.getContext('2d');
    const {isConnection, points} = this.props;

    context!.clearRect(0, 0, WIDTH, HEIGHT);

    //хранит массив уже нарисованных связей
    const helperArray: Array<number> = [];

    points.forEach((pointA, i) => {
      points.forEach((pointB, j) => {
        if (i !== j && isConnection(i, j) && !helperArray.includes(getGeneralIndex(i, j))) {
          drawConnection(context!, pointA, pointB);
          helperArray.push(getGeneralIndex(i, j));
        }
      });
      drawPoint(context!, pointA, i);
    });

    return false;
  };

  render() {
    return (
      <div>
        <canvas className={'Canvas BackgroundCanvas'} width={WIDTH} height={HEIGHT} ref={this.backgroundCanRef} />
        <canvas className={'Canvas'} width={WIDTH} height={HEIGHT} ref={this.canvasRef} />
        <br />
      </div>
    );
  }
}

export const D3_Canvas = connector(CanvasClass);
