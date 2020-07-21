import React from 'react';
import * as ReactDom from 'react-dom';
import './ring_slide_box.css';

interface ContentProp{
    slide_id:Number;
    title:string;
    description:string;
    background?:string;
    style?:any;
}
const SLIDE_BOX_PREFIX = "slide-box-";

class RingSlideBox extends React.Component<ContentProp>{
    constructor(props:ContentProp){
        super(props);
    }

    

    render(){
        return (
            <div className="RingSlideBox" style={this.props.style}>
                <div className="RingSlideText">
                    <h2>{this.props.title}</h2>
                    <p>{this.props.description}</p>
                </div>
                <div className="RingSlideButton" style={{backgroundImage: this.props.background}}>
                    <h1>{this.props.title} </h1>
                </div>
            </div>
        );
    };
}

export default RingSlideBox;
