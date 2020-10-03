import React, { Component } from 'react'
import {connect, ConnectedProps} from 'react-redux'
import {D3_Point} from '../Interfaces/CanvasInterface';
import {RootState} from '../Storage'
import {addPoint} from '../Storage/Actions/CanvasActions'
import {PointersType, PointersTypes} from '../Interfaces/CanvasInterface'
import {getPointArray} from '../Storage/CanvasReducer'
import '../Style/Canvas.css';

const HEIGHT: number = 440;
const WIDTH: number = 440;
const OFFSET: number = 10;

const YX_ANGLE: number = 120;
const YZ_ANGLE: number = 120;

const mapState = (state: RootState, ownProps: ownProps) => {
    return {
        isRecording: state.ServiceReducer.isRecording,
        pointsArray: state.CanvasReducer.pointsArray
    }
}

const mapDispatch = {
    addPoint
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type State = {}

type ownProps = {
    axes: {
        firstAxisName: string,
        secondAxisName: string,
        thirdAxisName: string,
    }
}
type Props = PropsFromRedux & ownProps

const DrawAxes = (context: CanvasRenderingContext2D, firstAxisName: string, secondAxisName: string, thirdAxisName: string) => {
    let alf: number;
    const point = {x:0, y:0};

    context.font = "bold 14px sans-serif";
    context.strokeStyle = "#000000";

    point.x = WIDTH/2;
    point.y = OFFSET;
    context.moveTo(WIDTH/2, HEIGHT/2);
    context.lineTo(point.x, point.y);
    context.fillText(firstAxisName, point.x, point.y);
    
    alf = (YX_ANGLE-90)*Math.PI/180;
    point.x = WIDTH - OFFSET;
    point.y = HEIGHT/2 + Math.tan(alf)*(WIDTH/2-OFFSET);
    context.moveTo(WIDTH/2, HEIGHT/2);
    context.lineTo(point.x, point.y);
    context.fillText(secondAxisName, point.x, point.y);

    alf = (YZ_ANGLE-90)*Math.PI/180;
    point.x = OFFSET;
    point.y = HEIGHT/2 + Math.tan(alf)*(WIDTH/2-OFFSET);
    context.moveTo(WIDTH/2, HEIGHT/2);
    context.lineTo(point.x, point.y);
    context.fillText(thirdAxisName, point.x, point.y);

    context.stroke();
}

const drawPoint = (context: CanvasRenderingContext2D, D3_point: D3_Point) => {
    const {x, y, z} = D3_point;
    let alf = -(YX_ANGLE-90)*Math.PI/180;
    
    const x_0 = WIDTH/2, y_0 = HEIGHT/2; 

    // экранировали на ось x
    const pointHelper = [
        (x+x_0 - x_0)*Math.cos(alf) - (0+y_0 - y_0)*Math.sin(alf) + x_0,
        (x+x_0 - x_0)*Math.sin(alf) + (0+y_0 - y_0)*Math.cos(alf) + y_0,
    ]

    alf = (180-YZ_ANGLE)*Math.PI/180;
    // сдвинули относительно z
    pointHelper[0] = pointHelper[0] - Math.sin(alf)*z;
    pointHelper[1] = pointHelper[1] - Math.cos(alf)*z;

    context.beginPath();
    context.arc(pointHelper[0], HEIGHT - pointHelper[1] - y, 2, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
}

class CanvasClass extends Component<Props, State> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    
    constructor(props: Props) {
        super(props);
        this.state = {
        }
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const context = this.canvasRef!.current!.getContext("2d");
        const {firstAxisName, secondAxisName, thirdAxisName} = this.props.axes;     

        if (!context) return;

        DrawAxes(context, firstAxisName, secondAxisName, thirdAxisName);
    }

    componentDidUpdate = (prevProps: Props, prevState: State) => {
        const context = this.canvasRef.current!.getContext('2d');
        const {pointsArray} = this.props;

        if (prevProps.pointsArray !== pointsArray) {
            const {firstAxisName, secondAxisName, thirdAxisName} = this.props.axes;
            context!.clearRect(0, 0, WIDTH, HEIGHT);
            DrawAxes(context!, firstAxisName, secondAxisName, thirdAxisName);

            this.props.pointsArray.forEach(drawPoint.bind(null, context!));
        }
    }

    render() {
        return <div>
            <canvas
                className={'Canvas'}
                width={WIDTH} height={HEIGHT}
                ref={this.canvasRef} 
            />
            <br />
        </div>;
    }
}

export const D3_Canvas = connector(CanvasClass);