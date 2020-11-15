import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {BezierPointComponent} from './Components/BezierPoint';
import {addPoint, dellPoint} from './Storage/Actions/BezierActions';
import {Point} from './Interfaces/BezierActionsInterface';
import {RootState} from './Storage';
import './Style/Bezier.css';
import {PointersTypes} from './Interfaces/CommonInterface';

const WIDTH = 430;
const HEIGHT = 430;
const OFFSET = 10;

const drawB = (context: CanvasRenderingContext2D) => {
  for (let x = 0.5; x < WIDTH; x += 10) {
    context.moveTo(x, 0);
    context.lineTo(x, HEIGHT);
  }

  for (let z = 0.5; z < HEIGHT; z += 10) {
    context.moveTo(0, z);
    context.lineTo(WIDTH, z);
  }

  context.strokeStyle = '#eee';
  context.stroke();

  context.beginPath();
  context.strokeStyle = '#000000';

  context.moveTo(OFFSET, OFFSET);
  context.lineTo(WIDTH - OFFSET, OFFSET);

  context.font = 'bold 14px sans-serif';
  context.textAlign = 'right';
  context.textBaseline = 'top';
  context.fillText('X', WIDTH - OFFSET, 15);

  context.moveTo(OFFSET, OFFSET);
  context.lineTo(OFFSET, HEIGHT - OFFSET);
  context.textAlign = 'left';
  context.textBaseline = 'bottom';
  context.fillText('Z', 15, HEIGHT - OFFSET);

  context.stroke();
};

const drawPointsLine = (context: CanvasRenderingContext2D, points: Array<Array<Point>>) => {
  points.forEach((points_2) => {
    context.beginPath();
    context.strokeStyle = '#e83737';

    points_2.reduce((pointA, pointB) => {
      context.moveTo(pointA.x, pointA.z);
      context.lineTo(pointB.x, pointB.z);

      return pointB;
    });

    context.stroke();
  });

  context.beginPath();
  context.strokeStyle = '#e83737';

  points.reduce((points_1, points_2) => {
    points_1.forEach((pointA, ind) => {
      const pointB = points_2[ind];

      context.moveTo(pointA.x, pointA.z);
      context.lineTo(pointB.x, pointB.z);
    });

    return points_2;
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

      drawPointsLine(context!, points);
    }
  }

  componentDidMount() {
    const {points} = this.props;

    const backgroundContext = this.backgroundCanRef!.current!.getContext('2d');
    drawB(backgroundContext!);

    const context = this.mainCanRef.current!.getContext('2d');
    drawPointsLine(context!, points);
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
        <canvas className={'BackgroundCanvas'} width={WIDTH} height={HEIGHT} ref={this.backgroundCanRef} />
        <div
          className={'Wrapper'}
          style={{
            width: WIDTH - 2 * OFFSET,
            height: HEIGHT - 2 * OFFSET,
            margin: OFFSET,
          }}
          ref={this.divFieldRef}>
          <canvas
            className={'MainCanvas'}
            width={WIDTH - 2 * OFFSET}
            height={HEIGHT - 2 * OFFSET}
            ref={this.mainCanRef}
          />
          {points.map((points_2, ind_1) => {
            return points_2.map((point, ind_2) => {
              return (
                <BezierPointComponent
                  parentRef={this.divFieldRef}
                  ind_1={ind_1}
                  ind_2={ind_2}
                  axisType={PointersTypes.XZ_axis}
                  key={`Bezier-BezierPointComponent-${ind_1}-${ind_2}`}
                />
              );
            });
          })}
        </div>
      </div>
    );
  }
}

export const Bezier = connector(BezierClass);
