import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {addPoint, dellPoint, dropPoints} from '../Storage/PolygonReducer/Actions/PolygonReducerAction';
import {ScreenPoint} from '../Interfaces/PolygonPointsInterface';
import {RootState} from '../Storage';
import {PointComponent} from './PointComponent';
import {setPolygonPoint} from '../Storage/PolygonReducer/Actions/PolygonReducerAction';
import {setScreenPoint} from '../Storage/ScreenReducer/Action/ScreenReducerAction';
import '../Style/MainField.css';

const canvasStyle = {
    width: 650,
    height: 700,
};

const mapState = (state: RootState) => ({
    polygonPoints: state.PolygonReducer.polygonPoints,
    screenPoint: state.ScreenReducer.screenPoint,
});

const mapDispatch = {
    dropPoints,
    addPoint,
    dellPoint,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type State = {};
type Props = PropsFromRedux & {};

class MainFieldClass extends React.Component<Props, State> {
    private backgroundCanRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    private mainCanRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    private divFieldRef: React.RefObject<HTMLDivElement> = React.createRef();
    private screenCanRef: React.RefObject<HTMLCanvasElement> = React.createRef();

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps: Props) {
        const {polygonPoints, screenPoint} = this.props;

        if (polygonPoints !== prevProps.polygonPoints) {
            const context = this.mainCanRef.current!.getContext('2d');
            context!.clearRect(0, 0, canvasStyle.width, canvasStyle.height);

            this.drawlines(context!, polygonPoints);
        }

        if (screenPoint !== prevProps.screenPoint) {
            const context = this.screenCanRef.current!.getContext('2d');
            context!.clearRect(0, 0, canvasStyle.width, canvasStyle.height);

            const arr: Array<ScreenPoint> = [
                screenPoint[0],
                {...screenPoint[0], x: screenPoint[1].x},
                screenPoint[1],
                {...screenPoint[1], x: screenPoint[0].x},
            ];

            this.drawlines(context!, arr);
        }
    }

    drawlines = (context: CanvasRenderingContext2D, pointsArr: Array<ScreenPoint>) => {
        context.beginPath();
        context.strokeStyle = '#000000';

        pointsArr.reduce((pointA, pointB) => {
            context.moveTo(pointA.x, pointA.y);
            context.lineTo(pointB.x, pointB.y);

            return pointB;
        });

        context.moveTo(pointsArr[0].x, pointsArr[0].y);
        context.lineTo(pointsArr[pointsArr.length - 1].x, pointsArr[pointsArr.length - 1].y);

        context.stroke();
    };

    componentDidMount() {
        const {screenPoint, polygonPoints} = this.props;
        this.drawB();

        this.drawlines(this.mainCanRef.current!.getContext('2d')!, polygonPoints);

        const arr: Array<ScreenPoint> = [
            screenPoint[0],
            {...screenPoint[0], x: screenPoint[1].x},
            screenPoint[1],
            {...screenPoint[1], x: screenPoint[0].x},
        ];

        this.drawlines(this.screenCanRef.current!.getContext('2d')!, arr);
    }

    drawB = () => {
        const backgroundContext = this.backgroundCanRef!.current!.getContext('2d');
        if (!backgroundContext) return;

        backgroundContext!.strokeStyle = '#eeee';

        for (let x = 0.5; x < canvasStyle.width; x += 10) {
            backgroundContext.moveTo(x, 0);
            backgroundContext.lineTo(x, canvasStyle.height);
        }

        for (let z = 0.5; z < canvasStyle.height; z += 10) {
            backgroundContext.moveTo(0, z);
            backgroundContext.lineTo(canvasStyle.width, z);
        }

        backgroundContext.stroke();
    };

    render() {
        const {polygonPoints, addPoint, dellPoint, dropPoints, screenPoint} = this.props;

        return (
            <div className={'MainField'}>
                <canvas
                    className={'BackgroundCanvas'}
                    width={canvasStyle.width}
                    height={canvasStyle.height}
                    ref={this.backgroundCanRef}
                />
                <div className={'Wrapper'} style={canvasStyle} ref={this.divFieldRef}>
                    <canvas
                        className={'MainCanvas'}
                        width={canvasStyle.width}
                        height={canvasStyle.height}
                        ref={this.mainCanRef}
                    />
                    <canvas
                        className={'ScreenCanvas'}
                        width={canvasStyle.width}
                        height={canvasStyle.height}
                        ref={this.screenCanRef}
                    />
                    {polygonPoints.map((point, ind) => (
                        <PointComponent
                            parentRef={this.divFieldRef}
                            ind={ind}
                            key={`MainField-polygonPoints-PointComponent-${ind}`}
                            ownSetPoint={setPolygonPoint}
                            point={point}
                        />
                    ))}
                    {screenPoint.map((point, ind) => (
                        <PointComponent
                            parentRef={this.divFieldRef}
                            ind={ind}
                            point={point}
                            ownSetPoint={setScreenPoint}
                            key={`MainField-screenPoint-PointComponent-${ind}`}
                        />
                    ))}
                </div>
                <div>
                    <button onClick={() => addPoint()}>{'Add point'}</button>
                    <button onClick={() => dellPoint()}>{'Dell point'}</button>
                    <button onClick={() => dropPoints()}>{'Drop points'}</button>
                </div>
            </div>
        );
    }
}

export const MainField = connector(MainFieldClass);
