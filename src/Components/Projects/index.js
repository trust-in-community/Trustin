import React from "react";
import {Typography, Row, Col, Button, Drawer} from 'antd';
import { firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux';
import {Trans, withTranslation} from "react-i18next";
import { compose } from 'redux'
import "./project.css"
import ProjectCard from "./ProjectCard";
import LastProject from "./LastProject";
import {getQuery, loadingView} from "../../functions/helper";
import {getProjects, getUpcomingProjects} from "../../functions/project";


class Index extends React.Component {

    state = {
        projects: [],
        currentUser: this.props.firebase.auth().currentUser,
        currentTopic: getQuery(this.props).topic,
        loading: true,
        allLoaded: false,
        upcomingProjects: [],
        upcomingLoading: false
    };


    componentDidMount = () => {
        this.getProjects(null);
        this.getUpcomingProjects()
    }


    getProjects = (startAt) => {
        getProjects(startAt).then(projects => {
            this.setState({
                projects: [...this.state.projects, ...projects],
                loading: false,
                allLoaded: projects.length < 20
            });
        }).catch(err => {
            this.setState({
                loading: false
            });
        });
    }

    loadMore = () => {
        const { projects } = this.state;
        this.setState({
            loading: true
        }, () => {
            this.getProjects(projects[projects.length-1].deadline);
        });
    }

    getUpcomingProjects = () => {
        this.setState({
            upcomingLoading: true
        })
        getUpcomingProjects().then(projects => {
            this.setState({
                upcomingLoading: false,
                upcomingProjects: projects
            })
        }).catch(err => {
            this.setState({
                upcomingLoading: false
            });
        });
    }



    render() {
        const { drawer, projects, upcomingProjects, loading, upcomingLoading, allLoaded } = this.state;
        const { t } = this.props;


        return (
            <div className="uk-padding uk-padding-remove-horizontal">
                <div className="uk-container uk-container-expand">
                    <Row gutter={window.innerWidth < 768 ? 0 : 16}>

                        <Col sm={24} md={17}>
                            <Row>
                                <Col span={20}>
                                    <div>
                                        <Typography.Title level={2} className="uk-text-bold uk-margin-remove">
                                            <Trans>
                                                Projects
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
                                title={t("Ending projects")}
                                placement="right"
                                closable={true}
                                onClose={() => this.setState({ drawer: !drawer })}
                                visible={drawer}
                                width="100%"
                                className={"phone uk-background-muted"}
                            >
                                <div className="uk-padding-small uk-background-muted uk-border-rounded">
                                    { upcomingLoading ? loadingView : upcomingProjects.map(project => (
                                        <LastProject project={project} />
                                    ))}
                                </div>
                            </Drawer>

                            { projects.map(project => (
                                <ProjectCard project={project} />
                            ))}

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


                        </Col>
                        <Col sm={24} md={7}>
                            <div className="uk-visible@m uk-padding-small uk-background-muted uk-border-rounded">
                                <Typography.Title level={3} className="uk-margin-remove-bottom">
                                    <Trans>
                                        Ending projects
                                    </Trans>
                                </Typography.Title>

                                { upcomingLoading ? loadingView : upcomingProjects.map(project => (
                                    <LastProject project={project} />
                                ))}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}



const enhance = compose(
    firebaseConnect(),
    connect()
)
export default enhance(withTranslation()(Index));
