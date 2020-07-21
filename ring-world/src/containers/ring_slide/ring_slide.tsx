import React from 'react';
import * as ReactDom from 'react-dom';
import RingSlideBox from './sub-components/ring_slide_box';
import './ring_slide.css';

interface Props{
}
interface State{
    slides_state?:[number,string,any][];
    x_ori:number;
    y_ori:number;
    radius:number;
}

const SLIDE_COUNT_NUM = 34;
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
        this.flag_drag = true;
        let inertia:number = 1;
        let moved_angle:number = 0;

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
            y_ori:document.body.clientHeight*1.6,
            // radius:document.body.clientHeight*1.2>250? document.body.clientHeight*1.2:250
            radius:document.body.clientHeight*1.2
        });
    }
    calcPos = (arcangle:number)=>{//按照弧度角计算元素的位置
        let x:number = this.state.radius*Math.sin(arcangle);
        let y:number = this.state.radius*Math.cos(arcangle);
        return {"x":x+ this.state.x_ori,"y":this.state.y_ori-y}
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
        if(angle==0)return;
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
                            let xy = this.calcPos(item[0]);
                            // let weight = 100- Math.round(Math.abs(this.state.x_ori-xy.x)/30);
                            let weight = Math.abs(this.state.x_ori-xy.x)>0.1?100- Math.floor(Math.log2(Math.abs((this.state.x_ori-xy.x)/10)*6)):100;
                            // let weight = 100- Math.floor(Math.pow((this.state.x_ori-xy.x)/10,2)); //不能小数差评
                            let scale = weight>=95? weight/95 : weight/100;// 中间的相对放大
                            scale *= (this.state.radius)/850; 
                            let x:number = xy.x - (SLIDE_WIDTH*scale/2);
                            let y:number = weight>97?xy.y*0.95:xy.y; // 把中间的往上放点
                            return(
                                <div key={index} className="RingSlideBlock"
                                    style= {{transform:'translate3d('+x+'px, '+y+'px, 0) '+'scale('+ scale+')',zIndex: weight? weight:0}}>
                                    <div style= {{transform: 'rotate(' + (item[0]*180/Math.PI)+ 'deg) ',transformOrigin:'center'}}>
                                        <RingSlideBox title="TEST" description="qwertyuilkjhgfdsdfghjhgf" slide_id={index}
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
