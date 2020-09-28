import {Col, Row, Carousel, Typography, Progress, Button} from "antd";
import React from "react";
import moment from "moment";
import {Trans, useTranslation} from "react-i18next";
import {Link} from "react-router-dom";


const ProjectCard = ({ project }) => {
    const { t, i18n } = useTranslation();

    const imageView = project.urls ? (
        <Carousel>
            { project.urls.map(image => (
                <img src={image.url} className="uk-width-1-1 uk-height-max-medium uk-margin-auto-vertical" />
            ))}
        </Carousel>
    ) : null;

    return (
        <div className="uk-box-shadow-medium uk-margin-bottom uk-background-muted">
            <Row>
                <Col sm={24} md={8}>
                    <div className="uk-width-1-1">
                        {imageView}
                    </div>
                </Col>
                <Col sm={24} md={16} className="uk-background-default">
                    <div className="uk-padding">
                        <h5 className="uk-text-bolder uk-text-uppercase projects-color">
                            { moment(project.deadline.seconds*1000).format("LL") }
                        </h5>
                        <Link to={`/projects/${project.id}`}>
                            <h3 className="apple-h2">
                                { project.title[i18n.language] }
                            </h3>
                        </Link>
                        <Typography.Paragraph ellipsis={{ expandable: false, rows: 3}}>
                            { project.details[i18n.language] }
                        </Typography.Paragraph>
                        <Row>
                            <Col span={12}>
                            <span className="uk-text-bold uk-color-black">
                                {project.collected}₸
                            </span>
                                <span> <Trans>raised</Trans></span>
                            </Col>
                            <Col span={12} className="uk-text-right uk-text-bolder">
                                {project.total}₸
                            </Col>
                        </Row>
                        <Progress percent={parseInt((project.current_amount ? project.current_amount : 0)*100/project.total_amount)} />
                        <div className="uk-grid-small uk-child-width-auto uk-margin-small-top" uk-grid="true">
                            <div>
                                <div className="uk-text-bolder">
                                    <Button size="large" style={{ borderRadius: "4px"}} className="projects-background-color" type="primary">
                                        <Trans>Donate</Trans>
                                    </Button>
                                </div>
                            </div>
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

                    </div>
                </Col>
            </Row>
        </div>
    )
}


export default ProjectCard;
