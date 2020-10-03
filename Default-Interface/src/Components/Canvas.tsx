import React, { Component } from 'react'
import {connect, ConnectedProps} from 'react-redux'
import {Point} from '../Interfaces/CanvasInterface';
import {RootState} from '../Storage'
import {addPoint} from '../Storage/Actions/CanvasActions'
import {PointersType, PointersTypes} from '../Interfaces/CanvasInterface'
import {getPointArray} from '../Storage/CanvasReducer'
import {PointComponent} from './PointComponent'
import '../Style/Canvas.css';

const HEIGHT: number = 220;
const WIDTH: number = 220;
const offset: number = 5;

const mapState = (state: RootState, ownProps: ownProps) => {
    return {
        isRecording: state.ServiceReducer.isRecording,
        pointsArray: getPointArray(state.CanvasReducer, ownProps.axes.axesType)
    }
}

const mapDispatch = {
    addPoint
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

// coordinate like (x, y) => (first, second)
type State = {
    coordinates: {
        first: number,
        second: number
    }
}

type ownProps = {
    axes: {
        verticalAxisName: string,
        horizontalAxisName: string,
        axesType: PointersType
    }
}
type Props = PropsFromRedux & ownProps

const DrawAxes = (context: CanvasRenderingContext2D, verticalAxisName: string, horizontalAxisName: string) => {
    for (let x = 0.5; x < WIDTH; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, HEIGHT);
    }

    for (let y = 0.5; y < HEIGHT; y += 10) {
        context.moveTo(0, y);
        context.lineTo(WIDTH, y);
    }

    context.strokeStyle = "#eee";
    context.stroke();

    context.beginPath();

    context.moveTo(offset, offset);
    context.lineTo(offset, HEIGHT - offset);

    context.moveTo(offset, HEIGHT - offset);
    context.lineTo(WIDTH - offset, HEIGHT - offset);

    context.strokeStyle = "#000000";
    context.stroke();

    context.font = "bold 14px sans-serif";
    context.textBaseline = "top";
    context.textAlign = "left";
    
    context.fillText(verticalAxisName, 2*offset, 2*offset);
    context.font = "bold 12px sans-serif";
    context.textBaseline = "bottom";
    context.fillText(`(0, 0)`, 2*offset, HEIGHT-2*offset);

    context.font = "bold 14px sans-serif";
    context.textAlign = "right";
    context.textBaseline = "bottom";
    context.fillText(horizontalAxisName, WIDTH - 2*offset, HEIGHT - 2*offset);

    context.font = "bold 12px sans-serif";
    context.textBaseline = "top";
    context.fillText(`(${WIDTH - 2*offset}, ${HEIGHT - 2*offset})`, WIDTH-2*offset, 2*offset);
}

const drawPoint = (context: CanvasRenderingContext2D, {first, second}: Point) => {
    context!.beginPath();
    context!.arc(first + offset, HEIGHT - second - offset, 2, 0, Math.PI * 2, true);
    context!.closePath();
    context!.fill();
}

class CanvasClass extends Component<Props, State> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    
    constructor(props: Props) {
        super(props);
        this.state = {
            coordinates: {
                first: 0.0,
                second: 0.0
            }
        }
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const context = this.canvasRef!.current!.getContext("2d");
        const {verticalAxisName, horizontalAxisName} = this.props.axes;     

        DrawAxes(context!, verticalAxisName, horizontalAxisName);
    }

    onMouseMove = (ev: MouseEvent) => {
        const canvas = this.canvasRef.current;
        const rect = canvas!.getBoundingClientRect();

        const first = ev.clientX - rect.left - offset; 
        const second = HEIGHT - ev.clientY;

        if (second >= 0 &&  first >= 0 && first <= (WIDTH - 2*offset) && second <= (HEIGHT - 2*offset)) {
            this.setState({coordinates: {first, second}});
        }
    }

    addPoint = () => {
        const {axesType} = this.props.axes;
        const {coordinates} = this.state;

        const {first, second} = coordinates;
        
        this.props.addPoint({first, second}, axesType);
    }

    componentDidUpdate = (prevProps: Props, prevState: State) => {
        const {
            isRecording, 
            pointsArray,
            axes
        } = this.props;

        const context = this.canvasRef.current!.getContext('2d');

        if (prevProps.isRecording !==isRecording) {
            if (isRecording) {
                this.canvasRef.current!.addEventListener("mousemove", this.onMouseMove);
                this.canvasRef.current!.addEventListener("mousedown", this.addPoint);
            } else {
                this.setState({coordinates: { first: 0, second: 0}});
                this.canvasRef.current!.removeEventListener("mousedown", this.addPoint);
            }
        }

        if (prevProps.pointsArray !== pointsArray) {
            const {verticalAxisName, horizontalAxisName} = axes;
            context!.clearRect(0, 0, WIDTH, HEIGHT);
            DrawAxes(context!, verticalAxisName, horizontalAxisName);

            pointsArray.forEach((point) => drawPoint(context!, point));
        }
    }

    render() {
        const {coordinates} = this.state;
        const {axes, pointsArray} = this.props;

        return <div className={"CanvasWrapper"}>
            <canvas
                className={'Canvas'}
                width={WIDTH} height={HEIGHT}
                ref={this.canvasRef} 
            />
            <br />
            {pointsArray.map((point, ind) => {
                const {first, second} = point;

                return (<PointComponent
                    key={`PointComponent-${ind}`} 
                    coordinates={{
                        first,
                        second: HEIGHT-second-offset
                    }}
                    ind={ind}
                    axesType={axes.axesType}
                    coordinatesToMove={coordinates}
                />)
            })}
            {`${axes.horizontalAxisName}: ${coordinates.first} | ${axes.verticalAxisName}: ${coordinates.second}`}
        </div>;
    }
}

export const Canvas = connector(CanvasClass);