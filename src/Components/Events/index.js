import {
    Badge, Col, Row, Typography, Collapse, Calendar, Button, List, Carousel, Drawer
} from "antd";
import React from "react";
import {Trans, withTranslation} from "react-i18next";
import "./events.css"
import moment from "moment";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import { CaretRightOutlined } from '@ant-design/icons';
import EventView from "./EventView";
import {getQuery, loadingView} from "../../functions/helper";
import {getTopics, getEvents, getMonthsEvents} from "../../functions/event";
import { Link } from "react-router-dom";
const { Panel } = Collapse;




class Index extends React.Component {

    state = {
        topics: [],
        events: [],
        currentUser: this.props.firebase.auth().currentUser,
        currentTopic: getQuery(this.props).topic,
        loading: true,
        allLoaded: false,
        monthEvents: [],
        monthLoading: false,
        currentMonth: new Date()
    };

    componentDidMount = () => {
        this.getTopics();
        this.getEvents(null);
        this.getMonthEvents(new Date())
    }

    getMonthEvents = () => {
        this.setState({
            monthLoading: true
        }, () => {
            getMonthsEvents(this.state.currentMonth).then(events => {
                this.setState({
                    monthLoading: false,
                    monthEvents: events
                });
            }).catch(err => {
                this.setState({
                    monthLoading: false,
                    monthEvents: []
                });
            })
        });
    }

    changeTopic = (topic) => {
        this.setState({
            currentTopic: this.state.currentTopic===topic.id ? null : topic.id,
            loading: true,
            events: []
        }, () => {
            this.getEvents(null);
        });
    }

    getTopics = () => {
        getTopics().then(topics => {
            this.setState({
                topics: topics
            })
        });
    }

    getEvents = (startAt) => {
        getEvents(startAt, this.state.currentTopic).then(events => {
            this.setState({
                events: [...this.state.events, ...events],
                loading: false,
                allLoaded: events.length < 20
            });
        }).catch(err => {
            this.setState({
                loading: false
            });
        });
    }

    loadMore = () => {
        const { events } = this.state;
        this.setState({
            loading: true
        }, () => {
            this.getEvents(events[events.length-1].date);
        });
    }

    changeMonth = value => {
        const { currentMonth } = this.state;
        this.setState({
            currentMonth: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + value, 1)
        });
        this.getMonthEvents();
    };


    render() {
        const { t, i18n } = this.props;
        const { drawer, currentMonth, monthEvents, monthLoading, allLoaded, loading, topics, events, currentTopic, currentUser } = this.state;
        const tagsView = (
            <div>
                <List
                    footer={
                        <div>
                            { topics.length } <Trans>tags</Trans>
                        </div>
                    }
                    pagination={{
                        pageSize: 10
                    }}
                    dataSource={topics}
                    renderItem={item => (
                        <List.Item>
                            <a onClick={() => this.changeTopic(item)} className="uk-width-1-1">
                                <Row className={
                                    currentTopic===item.id ? "uk-width-1-1 uk-text-bolder news-color" : "uk-width-1-1 uk-text-secondary"
                                }>
                                    <Col span={20}>
                                        {item[i18n.language]}
                                    </Col>
                                    <Col span={2} className="uk-text-right">
                                        <span className="fas fa-chevron-right" />
                                    </Col>
                                </Row>
                            </a>
                        </List.Item>
                    )}
                />
            </div>
        );

        return (
            <div className="uk-padding uk-padding-remove-horizontal">
                <div className="uk-container uk-container-expand">
                    <Row>
                        <Col span={20}>
                            <div>
                                <Typography.Title level={2} className="uk-text-bold uk-margin-remove">
                                    <Trans>
                                        Events
                                    </Trans>
                                </Typography.Title>
                            </div>
                        </Col>
                        <Col span={4}>
                            <div className={"uk-text-right uk-hidden@m"}>
                                <Typography.Title onClick={() => this.setState({ drawer: !drawer })} level={3} className="uk-margin-remove">
                                    <i className={"far fa-list"} />
                                </Typography.Title>
                            </div>
                        </Col>
                    </Row>
                    <h5 level={4} className="section-meta uk-text-muted uk-margin-bottom">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                    </h5>

                    <Drawer
                        title={t("Tags")}
                        placement="right"
                        closable={true}
                        onClose={() => this.setState({ drawer: !drawer })}
                        visible={drawer}
                        width="100%"
                        className={"phone uk-background-muted"}
                    >
                        <div className={"uk-padding-small"}>
                            { tagsView }
                        </div>
                    </Drawer>

                    <Row gutter={[ 20, 20]}>
                        <Col sm={24} md={16}>
                            <div>
                                <Row gutter={[ 12, 12]}>
                                    { events.map(event => (
                                        <Col sm={24} md={12}>
                                            <EventView topics={topics} key={event.id} event={event} currentUser={currentUser} />
                                        </Col>
                                    ))}
                                </Row>

                                { loading ? loadingView :
                                    <div className="uk-text-center">
                                        { allLoaded ? null :
                                            <Button onClick={this.loadMore} type="primary">
                                                <Trans>
                                                    Load more
                                                </Trans>
                                            </Button>
                                        }
                                    </div>
                                }
                            </div>
                        </Col>
                        <Col sm={24} md={8}>
                            <div className={"uk-visible@m"}>
                                <div className="uk-padding-small uk-background-muted uk-border-rounded">
                                    <Typography.Title level={3} className="uk-margin-remove-bottom">
                                        <Trans>
                                            Tags
                                        </Trans>
                                    </Typography.Title>
                                    { tagsView }
                                </div>
                                <div className=" uk-margin-top uk-padding-small uk-background-muted uk-border-rounded">
                                    <Row gutter={4}>
                                        <Col span={2}>
                                            <a onClick={() => this.changeMonth(-1)} className="uk-link-heading">
                                                <span uk-icon="chevron-left" />
                                            </a>
                                        </Col>
                                        <Col span={20} className="uk-text-center">
                                            <Typography.Title level={3} className="uk-margin-remove-bottom">
                                                <Trans>
                                                    Events on { moment(currentMonth).format("MMMM") }
                                                </Trans>
                                            </Typography.Title>
                                        </Col>
                                        <Col span={2}>
                                            <a onClick={() => this.changeMonth(+1)} className="uk-link-heading">
                                                <span uk-icon="chevron-right" />
                                            </a>
                                        </Col>
                                    </Row>
                                    { monthLoading ?  loadingView :
                                        <List
                                            itemLayout="vertical"
                                            size="large"
                                            pagination={{
                                                onChange: page => {
                                                    console.log(page);
                                                },
                                                pageSize: 3,
                                            }}
                                            dataSource={monthEvents}
                                            footer={
                                                <div>
                                                    { monthEvents.length } <Trans>events</Trans>
                                                </div>
                                            }
                                            renderItem={event => (
                                                <List.Item
                                                    key={event.title[i18n.language]}
                                                    actions={[
                                                        <span>
                                                    <i className="events-color fas fa-users" />{ event.members }
                                                </span>,
                                                        <span>
                                                    <i className="events-color far fa-comments" />{ event.comments }
                                                </span>,
                                                        <span>
                                                    <i className="events-color fas fa-map-marker-alt" /> {event.location[i18n.language]}
                                                </span>,
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        className="uk-margin-small-bottom"
                                                        title={<Link to={`/events/${event.id}`}>{event.title[i18n.language]}</Link>}
                                                        description={ moment(event.date*1000).format("MMMM D, HH:mm")}
                                                    />
                                                    { event.details[i18n.language].substring(0, 140) }
                                                </List.Item>
                                            )}
                                        />
                                    }
                                </div>

                            </div>
                        </Col>
                    </Row>

                </div>
            </div>
        );
    }

}

const enhance = compose(
    firestoreConnect(),
    connect()
)

export default enhance(withTranslation()(Index));
