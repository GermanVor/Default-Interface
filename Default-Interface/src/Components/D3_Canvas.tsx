import React, { Component } from 'react'
import {connect, ConnectedProps} from 'react-redux'
import {Point} from '../Interfaces/CanvasInterface';
import {RootState} from '../Storage'
import {addPoint} from '../Storage/Actions/CanvasActions'
import {PointersType, PointersTypes} from '../Interfaces/CanvasInterface'
import {getPointArray} from '../Storage/CanvasReducer'
import '../Style/Canvas.css';

const HEIGHT: number = 420;
const WIDTH: number = 420;
const OFFSET: number = 10;

const YX_ANGLE: number = 120;
const YZ_ANGLE: number = 120;

const mapState = (state: RootState, ownProps: ownProps) => {
    return {
        isRecording: state.ServiceReducer.isRecording,
    }
}

const mapDispatch = {
    addPoint
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type State = {
}

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

        if(!context) return;

        DrawAxes(context, firstAxisName, secondAxisName, thirdAxisName);
    }

    componentDidUpdate = (prevProps: Props, prevState: State) => {

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