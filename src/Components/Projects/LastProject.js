import {Col, Row, Carousel, Typography, Progress, Button, Divider, Avatar} from "antd";
import React from "react";
import moment from "moment";
import {Trans,useTranslation} from "react-i18next";
import {Link} from "react-router-dom";


const LastProject = ({ project }) => {
    const { i18n } = useTranslation();

    return (
        <div className="uk-margin-top uk-background-muted projects-cards">
            <div className="uk-card uk-card-default uk-inline">
                <div className="uk-card-body uk-padding-small">
                    <Link to={"/projects/" + project.id}>
                        <Typography.Title level={4}  className="uk-margin-small-bottom">
                            { project.title[i18n.language] }
                        </Typography.Title>
                    </Link>
                    <Typography.Paragraph  ellipsis={{ rows: 3, expandable: false }} className="uk-margin-small-top">
                        { project.details[i18n.language] }
                    </Typography.Paragraph>
                    <Row>
                        <Col span={12}>
                            <span className="uk-text-bold uk-color-black">
                                {project.collected}₸
                            </span>
                            <span> <Trans>raised</Trans></span>
                        </Col>
                        <Col span={12} className="uk-text-right">
                            { moment(project.deadline.seconds*1000).fromNow() }
                        </Col>
                    </Row>
                    <Progress percent={parseInt(project.collected*100/project.total)} />
                    <Divider className="uk-margin-small-top uk-margin-small-bottom" />
                    <Row>
                        <Col span={16}>
                            <div className="uk-grid-small uk-child-width-auto uk-margin-small-top" uk-grid="true">
                                <div className="uk-margin-auto-vertical">
                                    <span className="far fa-check-circle" /> {project.tasks.filter(task => task.done).length} <Trans>of</Trans> {project.tasks.length}
                                </div>
                                <div className="uk-margin-auto-vertical">
                                    <span className="far fa-hand-holding-usd" /> {project.contributors}
                                </div>
                                <div className="uk-margin-auto-vertical">
                                    <span className="far fa-comments" /> {project.comments}
                                </div>
                            </div>
                        </Col>
                        <Col span={8} className="uk-text-right uk-text-bolder">
                            <Button className="projects-background-color" style={{ borderRadius: "4px"}} type="primary">
                                <Trans>
                                    Donate
                                </Trans>
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}


export default LastProject;
