import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {
    addPolygonPoint,
    dellPolygonPoint,
    dropPolygonPoints,
    setPolygonPoint,
} from '../Storage/PolygonReducer/Actions/PolygonReducerAction';
import {
    setScreenPoint,
    addScreenPoint,
    dropScreenPoints,
    dellScreenPoint,
} from '../Storage/ScreenReducer/Action/ScreenReducerAction';
import {setState as setResultState} from '../Storage/ResultReducer/Action/ResultReducerAction';

import {StartWeilerAthertonAlgoritm} from '../Functions/Algoritm';

import {ScreenPoint} from '../Interfaces/PolygonPointsInterface';
import {RootState} from '../Storage';
import {PointComponent} from './PointComponent';

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
    dropPolygonPoints,
    addPolygonPoint,
    dellPolygonPoint,
    addScreenPoint,
    dropScreenPoints,
    dellScreenPoint,
    setResultState,
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
        const {polygonPoints, screenPoint, setResultState} = this.props;

        if (polygonPoints !== prevProps.polygonPoints) {
            const context = this.mainCanRef.current!.getContext('2d');
            context!.clearRect(0, 0, canvasStyle.width, canvasStyle.height);

            this.drawlines(context!, [...polygonPoints, polygonPoints[0]]);
        }

        if (screenPoint !== prevProps.screenPoint) {
            const context = this.screenCanRef.current!.getContext('2d');
            context!.clearRect(0, 0, canvasStyle.width, canvasStyle.height);
            context!.setLineDash([]);

            this.drawScreen();
        }

        if (polygonPoints !== prevProps.polygonPoints || screenPoint !== prevProps.screenPoint) {
            setResultState(polygonPoints, screenPoint);
        }
    }

    drawlines = (context: CanvasRenderingContext2D, pointsArr: Array<ScreenPoint>, isDefaultStyle = true) => {
        if (isDefaultStyle) {
            context.beginPath();
            context.strokeStyle = '#000000';
            context!.setLineDash([0]);
        }

        pointsArr.reduce((pointA, pointB) => {
            context.moveTo(pointA.x, pointA.y);
            context.lineTo(pointB.x, pointB.y);

            return pointB;
        });

        context.stroke();
    };

    drawScreen = () => {
        const {screenPoint} = this.props;

        const arr = [...screenPoint, screenPoint[0]];

        const context = this.screenCanRef.current!.getContext('2d');
        if (!context) return;

        context.beginPath();
        context.strokeStyle = '#000000';
        context.setLineDash([2, 4]);

        this.drawlines(context, arr, false);
    };

    componentDidMount() {
        const {polygonPoints, screenPoint} = this.props;
        this.drawB();

        const arr = [...polygonPoints, polygonPoints[0]];
        this.drawlines(this.mainCanRef.current!.getContext('2d')!, arr);

        this.drawScreen();

        // сам алготим получения многоуголника ебучего
        StartWeilerAthertonAlgoritm(polygonPoints, screenPoint);
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
        const {
            polygonPoints,
            addPolygonPoint,
            dellPolygonPoint,
            dropPolygonPoints,
            addScreenPoint,
            dropScreenPoints,
            dellScreenPoint,
            screenPoint,
        } = this.props;

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
                    <button onClick={() => addPolygonPoint()}>{'Add point'}</button>
                    <button onClick={() => dellPolygonPoint()}>{'Dell point'}</button>
                    <button onClick={() => dropPolygonPoints()}>{'Drop points'}</button>
                    <br />
                    <button onClick={() => addScreenPoint()}>{'Add screen point'}</button>
                    <button onClick={() => dellScreenPoint()}>{'Dell screen point'}</button>
                    <button onClick={() => dropScreenPoints()}>{'Drop screen points'}</button>
                </div>
            </div>
        );
    }
}

export const MainField = connector(MainFieldClass);
