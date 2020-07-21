import React from 'react';
import * as ReactDom from 'react-dom';

import RingSlide from '../containers/ring_slide/ring_slide';

class TestPage extends React.Component{
    constructor(props:any){
        super(props);
        this.state = {
        }
    }

    render(){
        return (
            <div className="TestPage">
                RingSlide
                <RingSlide/>
            </div>
        );
    };
}

export default TestPage;
