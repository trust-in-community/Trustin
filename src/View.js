import React from "react";
import Landing from "./Components/Landing";
import Story from "./Components/About/Story";
import Policy from "./Components/About/Policy";
import Team from "./Components/About/Team";
import NewNewsPost from "./Components/News/NewPost";
import News from "./Components/News";
import NewsPost from "./Components/News/NewsPost";
import NewEvent from "./Components/Events/NewEvent";
import AllEvents from "./Components/Events";
import Event from "./Components/Events/Event";
import NewProject from "./Components/Projects/NewProject";
import AllProjects from "./Components/Projects";
import Project from "./Components/Projects/Project";
import NewPost from "./Components/Posts/NewPost";
import AllPosts from "./Components/Posts";
import NewItem from "./Components/Shop/NewItem";
import Shop from "./Components/Shop";
import Chat from "./Components/Chat";
import User from "./Components/User";
import Search from "./Components/User/Search";
import SignUp from "./Components/SignUp/SignUp";
import Admin from "./Components/Admin";
import NavBar from "./Components/Layout/Header";
import Footer from "./Components/Layout/Footer";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import vars from "./config/vars.json";
import NotFound from "./Components/Layout/NotFound";

class View extends React.Component {

    render() {
        const currentUser = this.props.firebase.auth().currentUser;
        const currentView = this.props.match.path;
        const headerDisabled = ["/chats"];
        const adminPages = ["/news/new", "/events/new", "/projects/new", "/items/new", "/admin"];
        const loggedInPages = ["/posts/new", "/chats"];
        const isAdmin = currentUser&&currentUser.uid===vars.admin;
        const props = {
            ...this.props,
            isAdmin: isAdmin,
            currentView: currentView
        };
        const views = {
            "/": <Landing {...props} />,
            "/story": <Story  {...props} />,
            "/terms": <Policy  {...props} />,
            "/team": <Team  {...props} />,

            "/news/new": <NewNewsPost  {...props} />,
            "/news": <News  {...props} />,
            "/news/:id": <NewsPost  {...props} />,

            "/events/new": <NewEvent  {...props} />,
            "/events": <AllEvents  {...props} />,
            "/events/:id": <Event  {...props} />,

            "/projects/new": <NewProject  {...props} />,
            "/projects": <AllProjects  {...props} />,
            "/projects/:id": <Project  {...props} />,

            "/posts/new": <NewPost  {...props} />,
            "/posts": <AllPosts  {...props} />,

            "/items/new": <NewItem  {...props} />,
            "/items": <Shop  {...props} />,

            "/chats": <Chat {...props} />,

            "/users/:id": <User  {...props} />,
            "/users": <Search  {...props} />,

            "/signup": <SignUp  {...props} />,
            "/admin": <Admin  {...props} />
        };


        if(adminPages.includes(currentView) && !isAdmin){
            return (
                <div>
                    <NavBar/>
                      <NotFound {...props}/>
                    <Footer/>
                </div>
            );
        } else if(loggedInPages.includes(currentView) && !currentUser){
            return (
                <div>
                    <NavBar/>
                    <NotFound {...props}/>
                    <Footer/>
                </div>
            );
        } else if(headerDisabled.includes(currentView)) {
            return views[currentView]
        } else if (views[currentView]) {
            return (
                <div>
                    <NavBar/>
                    {views[currentView]}
                    <Footer/>
                </div>
            );
        } else {
            return (
                <div>
                    <NavBar/>
                    <NotFound {...props}/>
                    <Footer/>
                </div>
            );
        }
    }
}

const enhance = compose(
    firebaseConnect(),
    connect()
)
export default enhance(withTranslation()(View));