import React from "react";
import { Progress, Button, Typography, Row, Col, Card } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import "./projects.css"
import LargePost from "../News/PostCard";
import SmallPost from "../News/SmallPostCard";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import { Trans } from "react-i18next";
import {Link} from "react-router-dom";

class News extends React.Component {
    state = {
        current: 'mail',
    };

    style = {
        img: {
            width: "100%"
        },
        carousel: {
            paddingBottom: "50px"
        },
        icon: {
            width: "32px",
            height: "32px",
            backgroundColor: "white",
            borderRadius: "16px",
            textAlign: "center",
            fontSize: "18px",
            lineHeight: "32px",
            verticalAlign: "center"
        },
        post: {
            height: "calc(50vh)",
            backgroundImage: "url(https://www.dookinternational.com/blog/wp-content/uploads/2017/01/a32.jpg)",
            backgroundRepeat: false,
            backgroundSize: "cover"
        },
        height: {
            height: "calc(80vh + 96px)"
        },
        newsHeight: {
            height: "calc(80vh + 8px)"
        },
        smallNewsHeight: {
            height: "calc(40vh)"
        }
    }

    render() {
        const { news, topics } = this.props;
        return (
            <div className="uk-background-muted uk-padding uk-padding-remove-horizontal uk-margin-small-bottom uk-margin-small-top">
                <div className="uk-container uk-container-expand">
                    <Typography.Title level={2} className="section-header uk-text-center uk-text-bold uk-margin-remove">
                        <Trans>
                            News
                        </Trans>
                    </Typography.Title>
                    <h5 level={4} className="section-meta uk-text-center uk-text-muted uk-margin-bottom">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                        <Link to="/news" className="news-color" >
                            <Trans>
                                See All
                            </Trans>
                        </Link>
                    </h5>

                    <Row gutter={[8, 8]}>
                        <LargePost topics={topics} post={news[0]} />
                        <Col sm={24} md={24} lg={12}>
                            <Row gutter={[8, 8]}>
                                <SmallPost post={news[1]}/>
                                <SmallPost post={news[2]}/>
                                <SmallPost post={news[3]}/>
                                <SmallPost post={news[4]}/>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}



const mapStateToProps = (state) => {
    let topics = state.firebase.ordered.tags ? state.firebase.ordered.tags.news : [];
    topics = Array.isArray(topics) ? topics : [];
    let news = state.firebase.ordered.news ? state.firebase.ordered.news : [];
    news = Array.isArray(news) ? news : [];

    return {
        auth: state.firebase.auth,
        news: news.reverse().map(post => {
            return {
                id: post.key,
                ...post.value
            };
        }),
        topics: topics.map(tag => {
            return {
                id: tag.key,
                ...tag.value
            }
        })
    }
}

const enhance = compose(
    firebaseConnect([
        { type:"once", path: "/news", queryParams: [ "limitToLast=5" ]},
        { type:"once", path: "/tags/news" }
    ]),
    connect(mapStateToProps)
)
export default enhance(News);
