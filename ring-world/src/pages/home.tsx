import React from 'react';
import * as ReactDom from 'react-dom';

interface UserProp{

}
class HomePage extends React.Component<UserProp>{
    constructor(props:UserProp){
        super(props);
        this.state = {
          selection:"My Posts",
          posts:null,
        }
    }

    render(){
        return (
            <div className="HomePage">
                This is home page
            </div>
        );
    };
}

export default HomePage;
