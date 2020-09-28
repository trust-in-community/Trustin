import React from "react";
import { Menu, Row, Col} from 'antd';
import Legal from "./Team";
import "./index.css";
import Users from "./Users";
import Tags from "./Tags";
import { connect } from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase'
import { compose } from 'redux'
import {getQuery} from "../../functions/helper";
import Topics from "./Topics";
import {NavLink} from "react-router-dom";
import Edit from "./Edit";
import Team from "./Team";
import Shop from "../User/Shop";


class Admin extends React.Component {
    state = {
        currentView: "users"
    };


    componentDidMount = () => {
        if(getQuery(this.props).view) {
            this.setState({
                currentView: getQuery(this.props).view
            })
        }
    }


    onClick = (item) => {
        this.setState({
            currentView: item.key
        })
    }


    render() {

        const { currentView } = this.state;

        const content = () => {
            switch (currentView) {
                case "tags":
                    return <Tags/>
                case "topics":
                    return <Topics/>
                case "team":
                    return <Team {...this.props}/>
                case "story":
                    return <Edit type={"story"} />
                case "terms":
                    return <Edit type={"terms"} />
                case "shop":
                    return (
                        <div className={"uk-padding"}>
                            <Shop {...this.props} />
                        </div>
                    )
                default:
                    return <Users/>
            }
        };


        return (
            <div className="uk-container uk-background-muted uk-container-expand">
                <div className="uk-background-default">
                    <Row>
                        <Col span={6}>
                            <div>
                                <Menu
                                    style={{ width: "100%", minHeight: "calc(100vh)"}}
                                    selectedKeys={[currentView]}
                                    onClick={this.onClick}
                                    mode="inline"
                                >
                                    <Menu.Item key="users">
                                        <div>
                                            Users
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item key="shop">
                                        <div>
                                            Orders
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item key="news">
                                        <NavLink to={"/news/new"}>
                                            New post
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="events">
                                        <NavLink to={"/events/new"}>
                                            New event
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="projects">
                                        <NavLink to={"/projects/new"}>
                                            New project
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="items">
                                        <NavLink to={"/items/new"}>
                                            New item
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="tags">
                                        <div>
                                            Tags
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item key="topics">
                                        <div>
                                            Topics
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item key="story">
                                        <div>
                                            Story
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item key="terms">
                                        <div>
                                            Terms
                                        </div>
                                    </Menu.Item>
                                    <Menu.Item key="team">
                                        <div>
                                            Team
                                        </div>
                                    </Menu.Item>

                                </Menu>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div>
                                { content() }
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {

    console.log(state.firebase);

    return {
        auth: state.firebase.auth,
        tags: state.firebase.ordered.tags ? state.firebase.ordered.tags : []
    }
}

const enhance = compose(
    firestoreConnect([
        { collection: "tags" }
    ]),
    connect(mapStateToProps)
)
export default enhance(Admin);
