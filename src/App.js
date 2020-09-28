import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import View from "./View";


class App extends React.Component {


    render() {

        return (
            <BrowserRouter basename={"/"}>

                <Switch>
                    <Route exact path="/" component = { View } />
                    <Route exact path="/story" component = { View } />
                    <Route exact path="/terms" component = { View } />
                    <Route exact path="/team" component = { View } />


                    <Route exact path="/news" component = { View } />
                    <Route exact path="/news/new" component = { View } />
                    <Route exact path="/news/:id" component = { View } />

                    <Route exact path="/events" component = { View } />
                    <Route exact path="/events/new" component = { View } />
                    <Route exact path="/events/:id" component = { View } />

                    <Route exact path="/projects" component = { View } />
                    <Route exact path="/projects/new" component = { View } />
                    <Route exact path="/projects/:id" component = { View } />

                    <Route exact path="/posts" component = { View } />
                    <Route exact path="/posts/new" component = { View } />


                    <Route exact path="/items" component = { View } />
                    <Route exact path="/items/new" component = { View } />


                    <Route exact path="/chats" component = { View } />


                    <Route exact path="/users/" component = { View } />
                    <Route exact path="/users/:id" component = { View } />


                    <Route exact path="/signup" component = { View } />

                    <Route exact path="/admin" component = { View } />
                </Switch>

            </BrowserRouter>
        );
    }

}


export default App;
