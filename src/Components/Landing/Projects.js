import React from "react";
import { Progress, Button, Typography, Row, Col, Card } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import "./projects.css"
import LandingProjects from "../Projects/LandingProjects";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";

class Projects extends React.Component {

    render() {
        const { projects } = this.props;

        return (
            <div className="uk-padding uk-padding-remove-horizontal uk-margin-small-top uk-margin-small-bottom">
                <div className="uk-container uk-container-expand">
                    <Typography.Title level={2} className="section-header uk-text-center uk-text-bold uk-margin-remove">
                        Projects
                    </Typography.Title>
                    <h5 level={4} className="section-meta uk-text-center uk-text-muted uk-margin-bottom">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                        <a href={""} className="projects-color">
                            See All
                        </a>
                    </h5>


                    <div uk-slider="center: true">

                        <div className="uk-position-relative uk-visible-toggle uk-light" tabIndex="-1">

                            <ul className="uk-slider-items uk-child-width-1-2@s uk-child-width-1-4@m uk-child-width-1-4@l uk-grid-small">
                                { projects.map(project => (
                                    <LandingProjects project={project} />
                                ))}
                            </ul>

                            <a className="uk-position-center-left uk-position-small uk-hidden-hover" href="#"
                               uk-slidenav-previous="true" uk-slider-item="previous" />
                            <a className="uk-position-center-right uk-position-small uk-hidden-hover" href="#"
                               uk-slidenav-next="true" uk-slider-item="next" />

                        </div>

                        <ul className="projects-dotnav-color uk-slider-nav uk-dotnav uk-flex-center uk-margin" />

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    let projects = state.firebase.ordered.projects ? state.firebase.ordered.projects : [];
    projects = Array.isArray(projects) ? projects : [];

    return {
        auth: state.firebase.auth,
        projects: projects.map(project => {
            return {
                id: project.key,
                ...project.value
            };
        })
    }
}

const enhance = compose(
    firebaseConnect([
        { path: "/projects", queryParams: [ "orderByChild=deadline", "startAt=" + new Date().getTime()/1000, "limitToLast=10" ]}
    ]),
    connect(mapStateToProps)
)
export default enhance(withTranslation()(Projects));
