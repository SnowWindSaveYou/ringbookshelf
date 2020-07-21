import React from 'react';
import {HashRouter,Route,Switch} from 'react-router-dom';
import HomePage from '../pages/home';
import TestPage from '../pages/test_page';
import Article from '../page_templates/article_page_template';

const MainRouter = ()=>(
    <HashRouter>
        <Switch>
            <Route exact path = "/" component={HomePage}/>
            <Route exact path = "/test" component={TestPage}/>
            <Route exact path = "/article/:title" component={Article}/>
        </Switch>
    </HashRouter>

)
export default MainRouter;