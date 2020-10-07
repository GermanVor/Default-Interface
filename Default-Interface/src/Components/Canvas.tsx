import React, {Component} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Point} from '../Interfaces/CanvasInterface';
import {RootState} from '../Storage';
import {addPoint} from '../Storage/Actions/CanvasActions';
import {PointersType, PointersTypes} from '../Interfaces/CanvasInterface';
import {getPoint, isConnection, getGeneralIndex} from '../Storage/CanvasReducer';
import {PointComponent} from './PointComponent';
import '../Style/Canvas.css';

const HEIGHT = 220;
const WIDTH = 220;
const offset = 5;

const mapState = (state: RootState, ownProps: ownProps) => {
  return {
    isRecording: state.ServiceReducer.isRecording,
    points: getPoint(state.CanvasReducer, ownProps.axes.axesType),
    isConnection: isConnection.bind(null, state.CanvasReducer),
  };
};

const mapDispatch = {
  addPoint,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

// coordinate like (x, y) => (first, second)
type State = {
  coordinates: {
    first: number;
    second: number;
  };
};

type ownProps = {
  axes: {
    verticalAxisName: string;
    horizontalAxisName: string;
    axesType: PointersType;
  };
};
type Props = PropsFromRedux & ownProps;

const DrawAxes = (context: CanvasRenderingContext2D, verticalAxisName: string, horizontalAxisName: string) => {
  for (let x = 0.5; x < WIDTH; x += 10) {
    context.moveTo(x, 0);
    context.lineTo(x, HEIGHT);
  }

  for (let y = 0.5; y < HEIGHT; y += 10) {
    context.moveTo(0, y);
    context.lineTo(WIDTH, y);
  }

  context.strokeStyle = '#eee';
  context.stroke();

  context.beginPath();

  context.moveTo(offset, offset);
  context.lineTo(offset, HEIGHT - offset);

  context.moveTo(offset, HEIGHT - offset);
  context.lineTo(WIDTH - offset, HEIGHT - offset);

  context.strokeStyle = '#000000';
  context.stroke();

  context.font = 'bold 14px sans-serif';
  context.textBaseline = 'top';
  context.textAlign = 'left';

  context.fillText(verticalAxisName, 2 * offset, 2 * offset);
  context.font = 'bold 12px sans-serif';
  context.textBaseline = 'bottom';
  context.fillText(`(0, 0)`, 2 * offset, HEIGHT - 2 * offset);

  context.font = 'bold 14px sans-serif';
  context.textAlign = 'right';
  context.textBaseline = 'bottom';
  context.fillText(horizontalAxisName, WIDTH - 2 * offset, HEIGHT - 2 * offset);

  context.font = 'bold 12px sans-serif';
  context.textBaseline = 'top';
  context.fillText(`(${WIDTH - 2 * offset}, ${HEIGHT - 2 * offset})`, WIDTH - 2 * offset, 2 * offset);
};

const drawPoint = (context: CanvasRenderingContext2D, {first, second}: Point) => {
  context!.beginPath();
  context!.arc(Math.floor(first + offset), Math.floor(HEIGHT - second - offset), 2, 0, Math.PI * 2, true);
  context!.closePath();
  context!.fill();
};

const drawConnection = (context: CanvasRenderingContext2D, firstTop: Point, secondTop: Point) => {
  context.setLineDash([4, 16]);

  context!.beginPath();
  context!.moveTo(Math.floor(firstTop.first + offset), Math.floor(HEIGHT - firstTop.second - offset));
  context!.lineTo(Math.floor(secondTop.first + offset), Math.floor(HEIGHT - secondTop.second - offset));
  context!.stroke();
};

class CanvasClass extends Component<Props, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private backgroundCanRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      coordinates: {
        first: 0.0,
        second: 0.0,
      },
    };
    this.canvasRef = React.createRef();
    this.backgroundCanRef = React.createRef();
  }

  componentDidMount() {
    const backgroundContext = this.backgroundCanRef!.current!.getContext('2d');

    const {verticalAxisName, horizontalAxisName} = this.props.axes;

    DrawAxes(backgroundContext!, verticalAxisName, horizontalAxisName);
  }

  onMouseMove = (ev: MouseEvent) => {
    const canvas = this.canvasRef.current;
    const rect = canvas!.getBoundingClientRect();

    const first = ev.clientX - rect.left - offset;
    const second = HEIGHT - ev.clientY + offset;

    if (second >= 0 && first >= 0 && first <= WIDTH - 2 * offset && second <= HEIGHT - 2 * offset) {
      this.setState({coordinates: {first, second}});
    }
  };

  addPoint = (ev: MouseEvent) => {
    if (ev.button === 0) {
      const {axesType} = this.props.axes;
      const {coordinates} = this.state;

      const {first, second} = coordinates;

      this.props.addPoint({first, second}, axesType);
    }
  };

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    const {isRecording, points, isConnection} = this.props;

    const context = this.canvasRef.current!.getContext('2d', {alpha: false});

    if (prevProps.isRecording !== isRecording) {
      if (isRecording) {
        this.canvasRef.current!.addEventListener('mousemove', this.onMouseMove);
        this.canvasRef.current!.addEventListener('mousedown', this.addPoint);
      } else {
        this.setState({coordinates: {first: 0, second: 0}});
        this.canvasRef.current!.removeEventListener('mousedown', this.addPoint);
      }
    }

    if (prevProps.points !== points) {
      context!.clearRect(0, 0, WIDTH, HEIGHT);

      points.forEach(drawPoint.bind(null, context!));

      //хранит массив уже нарисованных связей
      const helperArray: Array<number> = [];

      points.forEach((pointA, i) => {
        points.forEach((pointB, j) => {
          if (i !== j && isConnection(i, j) && !helperArray.includes(getGeneralIndex(i, j))) {
            drawConnection(context!, pointA, pointB);
            helperArray.push(getGeneralIndex(i, j));
          }
        });
      });
    }
  };

  render() {
    const {coordinates} = this.state;
    const {axes, points} = this.props;

    return (
      <div className={'CanvasWrapper'}>
        <canvas className={'Canvas BackgroundCanvas'} width={WIDTH} height={HEIGHT} ref={this.backgroundCanRef} />
        <canvas className={'Canvas'} width={WIDTH} height={HEIGHT} ref={this.canvasRef} />
        {[...points].map(([ind, point]) => {
          const {first, second} = point;

          return (
            <PointComponent
              key={`PointComponent-${ind}`}
              //компоненты с других полей в это время смещаются благодаря этим координатам
              coordinates={{
                first,
                second: HEIGHT - second - offset,
              }}
              ind={ind}
              axesType={axes.axesType}
              // используются по назначению в активном поле
              coordinatesToMove={coordinates}
            />
          );
        })}
        <div className={'Scoreboard'}>
          {`${axes.horizontalAxisName}: ${coordinates.first} | ${axes.verticalAxisName}: ${coordinates.second}`}
        </div>
      </div>
    );
  }
}

export const Canvas = connector(CanvasClass);
