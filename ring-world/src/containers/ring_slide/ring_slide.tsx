import React from 'react';
import * as ReactDom from 'react-dom';
import RingSlideBox from './sub-components/ring_slide_box';
import './ring_slide.css';
import { Radio } from '@material-ui/core';

interface Props{
}
interface State{
    slides_state?:[number,string,any][];
    x_ori:number;
    y_ori:number;
    radius:number;
}

const SLIDE_COUNT_NUM = 38;
const LEFT_BOUND = 270;
const RIGHT_BOUND = 90;
const SLIDE_WIDTH = 220;
const SLIDE_HEIGHT = 310;

class RingSlide extends React.Component<Props,State>{
    flag_drag:boolean = false;
    last_angle:number = 0;
    cur_angle:number = 0;
    drag_interval:any;

    constructor(props:Props){
        super(props);
        this.state = {
            x_ori:0,
            y_ori:0,
            radius:0
        }
        
    }
    componentDidMount(){
        window.addEventListener('resize',this.resizeHandle.bind(this));
        this.resetCircle();
        this.loadSlides();
        window.addEventListener('mousedown',this.dragStartHandle.bind(this));
        window.addEventListener('mousemove',this.dragMoveHandle.bind(this));
        window.addEventListener('mouseup',this.dragEndHandle.bind(this));
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this.resizeHandle.bind(this));
        window.removeEventListener('mousedown',this.dragStartHandle.bind(this));
        window.removeEventListener('mousemove',this.dragMoveHandle.bind(this));
        window.removeEventListener('mouseup',this.dragEndHandle.bind(this));
    }
    dragStartHandle = (event:any)=>{
        clearInterval(this.drag_interval);
        this.last_angle = Math.atan2(event.clientY-this.state.y_ori,event.clientX-this.state.x_ori);
        this.cur_angle =  this.last_angle;
        this.flag_drag = true;
        let inertia:number = 1;
        let moved_angle:number = 0;
        // console.log("last",this.last_angle)
        this.drag_interval = setInterval( ()=> {
            if(this.flag_drag==false){
                this.rotateRing(moved_angle*inertia);
                inertia -= Math.abs(0.01/moved_angle);
                if(inertia<=1e-2){
                    console.log("stop")
                    clearInterval(this.drag_interval);
                }
                clearInterval(this.drag_interval);
            }else{
                moved_angle = this.cur_angle- this.last_angle;
                this.last_angle = this.cur_angle;
                this.rotateRing(moved_angle);
            }
        },30);
    }
    dragMoveHandle = (event:any)=>{
        if(this.flag_drag==true){
            this.cur_angle = Math.atan2(event.clientY-this.state.y_ori,event.clientX-this.state.x_ori);
            // console.log("cur",this.cur_angle )
        }
    }
    dragEndHandle = (event:any)=>{
        this.flag_drag = false;
    }
    resizeHandle = ()=>{
        this.resetCircle();
    }
    resetCircle = ()=>{ // 适配屏幕
        this.setState({
            x_ori:document.body.clientWidth /2, // 屏幕宽减去block宽/2,有点歪但问题不大√
            y_ori:document.body.clientHeight*1.5,
            // radius:document.body.clientHeight*1.2>250? document.body.clientHeight*1.2:250
            radius:document.body.clientHeight*1.0
        });
    }
    calcPos = (arcangle:number)=>{//按照弧度角计算元素的位置
        let x:number = this.state.radius*Math.sin(arcangle);
        let y:number =this.state.radius*Math.cos(arcangle);
        let z:number = Math.abs(Math.round(Math.cos(arcangle)*100));
        return {"x":x+ this.state.x_ori,"y":this.state.y_ori-y,"z":z}
    }
    loadSlides = ()=>{//TODO 
        let slides_state:[number,string,any][] = []; // angle ,color content
        const inner_angle = Math.PI*2/SLIDE_COUNT_NUM;
        for (let index = 0; index < SLIDE_COUNT_NUM; index++) {
            let color = "linear-gradient(to bottom right, "
                        +this.getAngleColor(index*360/SLIDE_COUNT_NUM)+"30%, "
                        +this.getAngleColor(index*360/SLIDE_COUNT_NUM +30)+"100% )"
            slides_state.push([inner_angle*index,color,index]);
        }
        this.setState({ slides_state: slides_state});
    }
    rotateRing = (angle:number=0)=>{
        if(angle==0 )return;
        let slides_state = this.state.slides_state;
        slides_state?.forEach(element => {
            element[0]+=angle;
        });
        this.setState({
            slides_state:slides_state
        })
    }
    getAngleColor = (angle:number)=>{
        angle *=1.5;
        if(angle>360){
            angle%=360;
        }
        let red = 60, green=60, blue = 60;
        const full = 255;
        if(angle<=60 || angle>=300){
            red = full;
        }else if(angle <=120){
            red = full*(120-angle)/60
        }else if(angle>=240){
            red = full*(angle-240)/60
        }
        
        if(angle>=60 && angle<=180){
            green = full;
        }else if(angle <60 ){
            green = full*angle/60;
        }else if(angle <=240){
            green = full*(240-angle)/60;
        }
        if(angle>=180 && angle<=300){
            blue = full;
        }else if(angle <180 && angle>120 ){
            blue = full*(angle-120)/60;
        }else if(angle >=300){
            blue = full*(360-angle)/60;
        }
        console.log("rgb("+red+", "+green+", "+blue+")")
        return "rgb("+red+", "+green+", "+blue+")"
    }

    render(){
        return (
            <div className="RingSlide" >
                {
                    this.state.slides_state?.map((item,index)=>{
                            // 计算元素位置属性，调参半天不建议修改
                            let xyz = this.calcPos(item[0]);
                            let z:number = xyz.z; // 把中间的往上放点
                            let scale:number = (z/100);
                            let x:number = (xyz.x +((this.state.x_ori-xyz.x)/100)**3/5)- (SLIDE_WIDTH*scale/2);//把较远的向中间偏移
                            let pad:number = (1/(xyz.y-(this.state.y_ori-this.state.radius-5)));
                            scale+=(pad)/2;
                            scale*=0.9;
                            let y:number = (xyz.y-pad*100);
                            return(
                                <div key={index} className="RingSlideBlock"
                                    style= {{transform:'translate3d('+x+'px, '+y+'px, 0) '+'scale('+ scale+')',zIndex: z? z:0}}>
                                    <div style= {{transform: 'rotate(' + (item[0]*180/Math.PI)+ 'deg) ',transformOrigin:'center'}}>
                                        <RingSlideBox title="TEST" description={"qwertyuilkjhgfdsdfghjhgf"+pad} slide_id={index}
                                        background={item[1]} />
                                    </div>
                                </div>
                            );
                    })
                }
            </div>
        );
    };
}

export default RingSlide;
