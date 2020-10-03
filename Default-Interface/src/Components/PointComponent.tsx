import React, { Component } from 'react'
import {connect, ConnectedProps} from 'react-redux'
import {RootState} from '../Storage'
import {setPoint} from '../Storage/Actions/CanvasActions'
import {PointersType, Point} from '../Interfaces/CanvasInterface'
import '../Style/PointComponent.css'

const mapState = (state: RootState, ownProps: ownProps) => {
    return {
    }
}

const mapDispatch = {
    setPoint
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type State = {
}

type ownProps = {
    coordinates: {
        first: number,
        second: number
    },
    ind: number,
    axesType: PointersType,
    coordinatesToMove: Point
}

type Props = PropsFromRedux & ownProps

class PointClass extends Component<Props, State> {
    private pointRef: React.RefObject<HTMLDivElement>;
    // private X: number;
    // private Y: number;
    private isMoving: boolean = false;

    constructor(props: Props) {
        super(props);
        this.state = {}
        this.pointRef = React.createRef();
    }

    mouseUpOfPoint = () => {
        this.isMoving = false; 
    }

    mouseDownOfPoint = () => {
        const elem = this.pointRef!.current;
        
        this.isMoving = true;
        elem!.addEventListener('mouseup', this.mouseUpOfPoint);
    }

    componentDidUpdate(prevProps: Props) {
        const {coordinatesToMove, setPoint, axesType, ind, coordinates} = this.props;
        const {first, second} = this.props.coordinates;
        const elem = this.pointRef!.current;

        if (this.isMoving && prevProps.coordinatesToMove !== coordinatesToMove) {
            setPoint(coordinatesToMove , axesType, ind);
        }

        if (prevProps.coordinates !== coordinates) {
            elem!.style.left = `${first}px`;
            elem!.style.top = `${second-elem!.clientHeight/2}px`;
        }
    }

    componentDidMount() {
        const {first, second} = this.props.coordinates;
        const elem = this.pointRef!.current;
        
        elem!.ondragstart = () => (false);
        
        elem!.style.left = `${first}px`;
        elem!.style.top = `${second-elem!.clientHeight/2}px`;

        elem!.addEventListener('mousedown', this.mouseDownOfPoint);
    }

    render() {
        const {ind} = this.props;

        return (<div 
            className="PointComponent" 
            ref={this.pointRef}>
        </div>)
    }
}

export const PointComponent = connector(PointClass);