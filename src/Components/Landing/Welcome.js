import React from "react";
import {Button, Typography, Row, Col, List, Avatar, Form, Rate, Dropdown, Menu} from 'antd';
import backgroundImage from "./students.jpg";
import {getProducts, getTags} from "../../functions/post";
import {Link} from "react-router-dom";
import {Trans, withTranslation} from "react-i18next";
import moment from "moment";
import {EllipsisOutlined} from "@ant-design/icons";
import {urlify} from "../../functions/helper";
import UIkit from "uikit";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {connect} from "react-redux";


class Welcome extends React.Component {
    state = {
        current: 'mail',
        posts: [],
        tags: [],
        currentUser: this.props.firebase.auth().currentUser,
    };

    componentDidMount() {
        getProducts(null, null, null, null).then(posts => {
            this.setState({
                posts: posts
            });
        });
        getTags().then(tags => {
            this.setState({
                tags: tags
            })
        });
    }

    background = {
        height: "calc(100vh - 112px)",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundRepeat: false,
        backgroundSize: "cover",
        position: "relative"
    }



    render() {
        const { posts, tags, currentUser } = this.state;
        const { i18n } = this.props;

        return (
            <div >
                <div style={this.background}>
                    <div className={"uk-container"}>
                        <div>
                            <div className="uk-width-expand uk-width-xlarge@s welcome-header">
                                <div className={"uk-light"}>
                                    <Typography.Title level={2}>
                                        <span className={"white-color"}>
                                            <Trans>
                                                We Trust in Community
                                            </Trans>
                                        </span>
                                        <Typography.Title className={"secondary-color"} level={4}>
                                            <Trans>
                                                Official website of Taraz KTL Alumni
                                            </Trans>
                                        </Typography.Title>
                                    </Typography.Title>

                                    <Typography.Paragraph className="welcome-meta white-color">
                                        <Trans>
                                            Taraz KTL (now BIL) Alumni Association "Trust in Community" was opened on October 22, 2019 as a legal entity engaged in a special project. The main purpose of the association, initiated by sympathetic graduates, is to benefit society.
                                        </Trans>
                                    </Typography.Paragraph>
                                    { currentUser&&currentUser.uid ? null : (
                                        <Button className="uk-margin-small-right" type="primary">
                                            <Trans>
                                                Sign Up
                                            </Trans>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="uk-container uk-margin-large-top">
                    <div className={"uk-text-center"}>
                        <h2>
                            <Trans>
                                About Us
                            </Trans>
                        </h2>
                    </div>
                    <div>
                        <Row gutter={[8,8]}>
                            <Col sm={24} md={8}>
                                <div className="uk-background-muted uk-border-rounded uk-padding-small">
                                    <div className={"uk-text-center uk-padding-small"}>
                                        <img className="uk-height-small" style={{ maxWidth: "100%" }} src={require("./shop.svg")} />
                                    </div>
                                    <Link to={"/items"}>
                                        <h4 className="uk-margin-remove main-color">
                                            <Trans>
                                                Get our merch
                                            </Trans>
                                        </h4>
                                    </Link>

                                    <p className="uk-margin-remove ">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                    </p>
                                </div>
                            </Col>
                            <Col sm={24} md={8}>
                                <div className="uk-background-muted uk-border-rounded uk-padding-small">
                                    <div className={"uk-text-center uk-padding-small"}>
                                        <img className="uk-height-small" style={{ maxWidth: "100%" }} src={require("./news.svg")} />
                                    </div>
                                    <Link to={"/news"}>
                                        <h4 className="uk-margin-remove main-color">
                                            <Trans>
                                                Read latest news
                                            </Trans>
                                        </h4>
                                    </Link>
                                    <p className="uk-margin-remove ">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                    </p>
                                </div>
                            </Col>
                            <Col sm={24} md={8}>
                                <div className="uk-background-muted uk-border-rounded uk-padding-small">
                                    <div className={"uk-text-center uk-padding-small"}>
                                        <img className="uk-height-small" style={{ maxWidth: "100%" }} src={require("./event.svg")} />
                                    </div>
                                    <Link to={"/events"}>
                                        <h4 className="uk-margin-remove main-color">
                                            <Trans>
                                                Join events
                                            </Trans>
                                        </h4>
                                    </Link>

                                    <p className="uk-margin-remove ">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                    </p>
                                </div>
                            </Col>
                            <Col sm={24} md={12}>
                                <div className="uk-background-muted uk-border-rounded uk-padding-small">
                                    <div className={"uk-text-center uk-padding-small"}>
                                        <img className="uk-height-small uk-height-medium@m" style={{ maxWidth: "100%" }} src={require("./project.svg")} />
                                    </div>
                                    <Link to={"/projects"}>
                                        <h4 className="uk-margin-remove main-color">
                                            <Trans>
                                                Support projects
                                            </Trans>
                                        </h4>
                                    </Link>

                                    <p className="uk-margin-remove ">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                    </p>
                                </div>
                            </Col>
                            <Col sm={24} md={12}>
                                <div className="uk-background-muted uk-border-rounded uk-padding-small">
                                    <div className={"uk-text-center uk-padding-small"}>
                                        <img className="uk-height-small uk-height-medium@m"  style={{ maxWidth: "100%" }} src={require("./post.svg")} />
                                    </div>

                                    <Link to={"/posts"}>
                                        <h4 className="uk-margin-remove main-color ">
                                            <Trans>
                                                Share and find needs
                                            </Trans>
                                        </h4>
                                    </Link>

                                    <p className="uk-margin-remove ">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>


                <div className="uk-container uk-margin-large-top">
                    <div className={"uk-text-center"}>
                        <h2>
                            <Trans>
                                Latest posts
                            </Trans>
                        </h2>
                    </div>
                    <div>
                        <div className="posts-list">
                            <Row gutter={[8, 8]}>
                                { posts.map(item => (
                                    <Col sm={24} md={12}>
                                        <div className={"uk-background-muted uk-border-rounded uk-padding-small"}>
                                            <List.Item.Meta
                                                avatar={<Avatar src={item.author.avatar} />}
                                                title={
                                                    <div>
                                                        <div>
                                                            <h6 className="uk-margin-remove">
                                                                <a className="uk-link-heading" href={item.href}>
                                                                    {item.author.name}
                                                                </a>
                                                            </h6>
                                                            <small className="uk-text-muted">
                                                                { item.updatedAt ? `Updated at ${moment(item.updatedAt.seconds * 1000).format("LLL")}` : moment(item.createdAt.seconds * 1000).format("LLL") } • { tags.find(tag => tag.id===item.topic) ? tags.find(tag => tag.id===item.topic).value[i18n.language] : null }
                                                            </small>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                            <h5 className="uk-margin-remove">
                                                {item.title} {item.price ? ` • ${item.price}₸` : null}
                                            </h5>
                                            <Typography.Paragraph ellipsis={{ expandable: true, rows: 3}} className="uk-margin-remove-bottom">
                                                { item.details ? urlify(item.details).text : null }
                                            </Typography.Paragraph>
                                            { item.details ? urlify(item.details).urls.map(url => (
                                                <a href={url}>
                                                    <span uk-icon={"link"}/> {url.replace('http://','').replace('https://','').split(/[/?#]/)[0]}
                                                </a>
                                            )) : null }
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </div>
                </div>


                <div className="uk-container uk-margin-large-top">
                    <div className={"uk-text-center"}>
                        <h2>
                            <Trans>
                                Sponsors
                            </Trans>
                        </h2>
                    </div>
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col sm={24} md={8}>
                                <div className={"uk-text-center uk-height-small"}>
                                    <img className={"uk-height-1-1"}  src={require("./sponsor-1.png")} />
                                </div>
                            </Col>
                            <Col sm={24} md={8}>
                                <div className={"uk-text-center uk-height-small"}>
                                    <img className={"uk-height-1-1"}  src={require("./sponsor-2.png")} />
                                </div>
                            </Col>
                            <Col sm={24} md={8}>
                                <div className={"uk-text-center uk-height-small"}>
                                    <img className={"uk-height-1-1"}  src={require("./sponsor-3.png")} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>



            </div>
        );
    }
}


const enhance = compose(
    firebaseConnect(),
    connect()
)
export default enhance(withTranslation()(Welcome));
