import {Button, Avatar, Col, Divider, Progress, Row, Typography, Carousel} from "antd";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import moment from "moment";
import "./project.css"

const LandingProjects = ({ project }) => {
    const { i18n } = useTranslation();
    const imageView = project.urls ? (
        <Carousel>
            { project.urls.map(image => (
                <img src={image.url} className="uk-height-medium projects-image" />
            ))}
        </Carousel>
    ) : null;
    const style = {
        icon: {
            width: "32px",
            height: "32px",
            backgroundColor: "white",
            borderRadius: "16px",
            textAlign: "center",
            fontSize: "18px",
            lineHeight: "32px",
            verticalAlign: "center"
        }
    }

    return (
        <li>
            <div className="uk-card uk-card-default uk-inline uk-border-rounded">
                <div className="uk-card-media-top project-carousel">
                    { imageView }
                </div>
                <div className="uk-card-body uk-padding-small">
                    <a href={"/projects/" + project.id}>
                        <Typography.Title level={4}  className="uk-margin-small-bottom">
                            { project.title[i18n.language] }
                        </Typography.Title>
                    </a>

                    <Typography.Paragraph  ellipsis={{ rows: 3, expandable: false }} className="uk-margin-small-top">
                        { project.details[i18n.language] }
                    </Typography.Paragraph>
                    <Row>
                        <Col span={12}>
                            <span className="uk-text-bold uk-color-black">
                                {project.current_amount ? project.current_amount : 0}₸
                            </span>
                            <span> <Trans>raised</Trans></span>
                        </Col>
                        <Col span={12} className="uk-text-right uk-text-bolder">
                            { moment(project.deadline*1000).format("LL") }
                        </Col>
                    </Row>
                    <Progress percent={parseInt((project.current_amount ? project.current_amount : 0)*100/project.total_amount)} />
                    <Divider className="uk-margin-small-top uk-margin-small-bottom" />
                    <Row>
                        <Col span={16}>
                            <div className="uk-grid-small uk-child-width-auto uk-margin-small-top" uk-grid="true">
                                <div className="uk-margin-auto-vertical">
                                    <span className="far fa-check-circle" /> {project.tasks.filter(task => task.done).length} <Trans>of</Trans> {project.tasks.length}
                                </div>
                                <div className="uk-margin-auto-vertical">
                                    <span className="far fa-hand-holding-usd" /> {project.donations ? Object.keys(project.donations).length : 0}
                                </div>
                                <div className="uk-margin-auto-vertical">
                                    <span className="far fa-thumbs-up" /> {project.likes ? Object.keys(project.likes).length : 0}
                                </div>
                                <div className="uk-margin-auto-vertical">
                                    <span className="far fa-comments" /> {project.comments ? Object.keys(project.comments).length : 0}
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
        </li>
    );
}


export default LandingProjects;
