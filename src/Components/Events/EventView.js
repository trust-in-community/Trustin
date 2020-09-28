import React from "react";
import {Trans, withTranslation} from "react-i18next";
import {Carousel, Col, message, Popconfirm, Row, Spin} from "antd";
import moment from "moment";
import {joinEvent, leaveEvent, isJoined } from "../../functions/event";



class EventView extends React.Component {

    state = {
        isJoined: false,
        event: this.props.event,
        currentUser: this.props.currentUser
    }


    componentDidMount() {
        isJoined(this.state.event.id).then(isJoined => {
            this.setState({
                isJoined: isJoined
            })
        })
    }

    participate = () => {
        const { isJoined, event } = this.state;
        if(isJoined){
            leaveEvent(event.id).then(() => {
                this.setState({
                    event: {
                        ...event,
                        members: event.members - 1
                    },
                    isJoined: false
                });
            }).catch(err => {
                message.error(err.message);
            })
        } else {
            joinEvent(event.id).then(() => {
                this.setState({
                    event: {
                        ...event,
                        members: event.members + 1
                    },
                    isJoined: true
                });
            }).catch(err => {
                message.error(err.message);
            })
        }
    }

    render() {
        const { t, i18n, view, topics } = this.props;
        const { event, currentUser, isJoined } = this.state;

        return (
            <div className={view ? "" : "uk-padding-small uk-box-shadow-medium"}>
                <div className='uk-padding-small uk-padding-remove-horizontal'>
                    <h6 id={event.id} className="uk-text-uppercase events-color">
                        <Trans>
                            { moment(event.date*1000).format("MMMM D, HH:mm")} • { topics.find(topic => topic.id===event.topic) ? topics.find(topic => topic.id===event.topic)[i18n.language] : null }
                        </Trans>
                    </h6>
                    <a href={"/events/"+event.id}>
                        <h3 className="apple-h3">
                            { event.title[i18n.language] }
                        </h3>
                    </a>
                    <ul className="uk-grid-small uk-child-width-auto" uk-grid="true">
                        <li className="uk-text-secondary">
                            <i className="events-color fas fa-map-marker-alt" /> {event.location[i18n.language]}
                        </li>
                    </ul>
                    { event.details[i18n.language].substring(0, 280) }
                    <ul className="uk-grid-small uk-child-width-auto" uk-grid="true">
                        { event.link ?
                            <li>
                                <a target="_blank" href={event.link} className="uk-button-text">
                                    <i className="events-color fas fa-link" /> <Trans>Register</Trans>
                                </a>
                            </li>
                            : null }
                        <li>
                            <a className="uk-text-secondary">
                                <i className="events-color far fa-comments" />{ event.comments }
                            </a>
                        </li>

                        <li>
                            <a className="uk-text-secondary">
                                <i className="events-color fas fa-users" />{ event.members }
                            </a>
                        </li>
                    </ul>
                    { currentUser&&currentUser.uid ?
                    <div className="uk-margin-top">
                        { isJoined ?
                            <Popconfirm
                                title={t("Leave the event?")}
                                onConfirm={this.participate}
                                okText={t("Leave")}
                                cancelText={t("Dismiss")}
                            >
                                <a className="uk-button uk-button-small uk-button-secondary uk-button-danger-outline">
                                    <Trans>Leave the event</Trans>
                                </a>
                            </Popconfirm>
                            :
                            <button className="uk-button uk-button-small uk-button-secondary events-background-color" onClick={this.participate}>
                                <Trans>Join the event</Trans>
                            </button>
                        }
                    </div>
                    : null }
                </div>
            </div>
        );
    }
}

export default withTranslation()(EventView);
