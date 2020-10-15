import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {BezierPointComponent} from './Components/BezierPoint';
import {addPoint, dellPoint} from './Storage/Actions/BezierActions';
import {Point} from './Interfaces/BezierActionsInterface';
import {RootState} from './Storage';
import './Style/Bezier.css';

const WIDTH = 700;
const HEIGHT = 500;

const BEZIER_DRAW_STEP = 0.01;

const getBezierBasis = (i: number, n: number, t: number): number => {
  const factor = (i: number): number => {
    return i <= 1 ? 1 : i * factor(i - 1);
  };

  return (factor(n) / (factor(i) * factor(n - i))) * Math.pow(t, i) * Math.pow(1 - t, n - i);
};

const drawB = (context: CanvasRenderingContext2D) => {
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
};

const drawBezierLine = (context: CanvasRenderingContext2D, points: Array<Point>) => {
  const arrayPointsToDraw: Array<Point> = [];
  for (let t = 0; t < 1 + BEZIER_DRAW_STEP; t += BEZIER_DRAW_STEP) {
    const k = arrayPointsToDraw.push({x: 0, y: 0}) - 1;
    for (let i = 0; i < points.length; i++) {
      const N = getBezierBasis(i, points.length - 1, t);

      arrayPointsToDraw[k].x += points[i].x * N;
      arrayPointsToDraw[k].y += points[i].y * N;
    }
  }
  context.beginPath();
  context.strokeStyle = '#000000';

  arrayPointsToDraw.reduce((pointA, pointB) => {
    context.moveTo(pointA.x, pointA.y);
    context.lineTo(pointB.x, pointB.y);

    return pointB;
  });

  context.stroke();

  context.beginPath();
  context.strokeStyle = '#e83737';

  points.reduce((pointA, pointB) => {
    context.moveTo(pointA.x, pointA.y);
    context.lineTo(pointB.x, pointB.y);

    return pointB;
  });

  context.stroke();
};

const mapState = (state: RootState) => ({
  points: state.BezierReducer.points,
});

const mapDispatch = {
  addPoint,
  dellPoint,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {};
type Props = PropsFromRedux & {};

class BezierClass extends React.Component<Props, State> {
  private backgroundCanRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  private mainCanRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  private divFieldRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps: Props) {
    const {points} = this.props;

    if (points !== prevProps.points) {
      const context = this.mainCanRef.current!.getContext('2d');
      context!.clearRect(0, 0, WIDTH, HEIGHT);

      drawBezierLine(context!, points);
    }
  }

  componentDidMount() {
    const {points} = this.props;

    const backgroundContext = this.backgroundCanRef!.current!.getContext('2d');
    drawB(backgroundContext!);

    const context = this.mainCanRef.current!.getContext('2d');
    drawBezierLine(context!, points);
  }

  addPoint = () => {
    this.props.addPoint();
  };

  deletePoint = () => {
    this.props.dellPoint();
  };

  render() {
    const {points} = this.props;
    return (
      <div className={'Bezier'}>
        <div
          className={'Wrapper'}
          style={{
            width: WIDTH,
            height: HEIGHT,
          }}
          ref={this.divFieldRef}>
          <canvas className={'BackgroundCanvas'} width={WIDTH} height={HEIGHT} ref={this.backgroundCanRef} />
          <canvas className={'MainCanvas'} width={WIDTH} height={HEIGHT} ref={this.mainCanRef} />
          {points.map((point, ind) => {
            return <BezierPointComponent parentRef={this.divFieldRef} ind={ind} key={`BezierPointComponent-${ind}`} />;
          })}
          <div className={'Menu'}>
            <button onClick={this.addPoint}>{'Add Point'}</button>
            <button onClick={this.deletePoint}>{'Delete'}</button>
          </div>
        </div>
      </div>
    );
  }
}

export const Bezier = connector(BezierClass);
