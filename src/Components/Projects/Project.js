import React from "react";
import {
    Timeline,
    List,
    Checkbox,
    Alert,
    Typography,
    Row,
    Col,
    Divider,
    Carousel,
    Form,
    Button,
    Input,
    notification,
    Spin, Popconfirm, InputNumber, DatePicker, Tabs, Affix, Progress, Avatar, message
} from 'antd';
import moment from 'moment';
import "./project.css"
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {a, Link, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {Trans, useTranslation, withTranslation} from "react-i18next";
import UIkit from "uikit";
import vars from "../../config/vars.json"
import {
    createComment,
    updateComment,
    deleteComment,
    getComments,
    getStory,
    getContributors,
    getProject,
    updateProject,
    createStory,
    deleteStory, deleteProject
} from "../../functions/project";
import {handleFiles} from "../Helper/Handler";
import {loadingView} from "../../functions/helper";
const { TextArea } = Input;
const { TabPane } = Tabs;


class Project extends React.Component {

    state = {
        loading: false,
        comment: "",
        commentId: null,
        files: [],
        images: [],
        stories: [],
        comments: [],
        project: null,
        contributors: [],
        currentUser: this.props.firebase.auth().currentUser,
    };

    componentDidMount() {
        getProject(this.props.match.params.id).then(project => {
            console.log(project)
            this.setState({
                project: project
            })
        }).catch(err => {
            this.props.history.push("/projects")
        })
        this.getComments();
        this.getContributors();
        this.getStories();
    }


    getComments = () => {
        getComments(this.props.match.params.id).then(comments => {
            this.setState({
                comments: comments
            })
        });
    }

    getStories = () => {
        getStory(this.props.match.params.id).then(stories => {
            this.setState({
                stories: stories
            })
        });
    }

    getContributors = () => {
        getContributors(this.props.match.params.id).then(contributors => {
            this.setState({
                contributors: contributors
            })
        });
    }

    submitComment = () => {
        const { currentUser, project, commentId, comment, comments } = this.state;
        if (!comment || !currentUser || !currentUser.uid) {
            return;
        }
        if(commentId) {
            updateComment(project.id, comment, commentId).then(() => {
                const index = comments.findIndex(comment => comment.id===commentId);
                comments[index].body = comment;
                this.setState({
                    comment: "",
                    comments: comments,
                    commentId: null
                });
            }).catch(err => {
                message.error(err.message);
            })
        } else {
            const newComment = {
                author: {
                    uid: currentUser.uid,
                    name: currentUser.displayName,
                    avatar: currentUser.photoURL
                },
                body: comment,
                createdAt: new Date()
            };
            createComment(project.id, newComment).then(doc => {
                newComment.id = doc.id;
                this.setState({
                    comment: "",
                    comments: [...comments, newComment],
                    commentId: null,
                    project: {
                        ...project,
                        comments: project.comments + 1
                    }
                });
            }).catch(err => {
                message.error(err.message);
            })
        }
    };

    editComment = (comment) => {
        this.setState({
            commentId: comment.id,
            comment: comment.body
        })
    }

    cancelEdit = () => {
        this.setState({
            commentId: null,
            comment: ""
        })
    }

    deleteComment = (comment) => {
        const { comments, project, currentUser } = this.state;
        if (!currentUser || !currentUser.uid) {
            return;
        }
        deleteComment(project.id, comment.id).then(() => {
            const index = comments.findIndex(item => comment.id===item.id);
            comments.splice(index, 1);
            this.setState({
                comment: "",
                comments: comments,
                project: {
                    ...project,
                    comments: project.comments - 1
                }
            })
        }).catch(err => {
            message.error(err.message);
        });
    }

    handleChange = e => {
        this.setState({
            comment: e.target.value
        })
    };

    submitFAQ = (values) => {
        const { project } = this.state;
        const faqs = [
            ...project.faqs,
            {
                question: values.title,
                answer: values.answer
            }
        ]
        updateProject(project.id, {
            faqs: faqs
        }).then(() => {
            project.faqs = faqs;
            this.setState({
                project: project
            })
        }).catch(err => {
            message.error(err.message);
        });
    }

    deleteFAQ = (index) => {
        const { project } = this.state;
        project.faqs.splice(index, 1);
        updateProject(project.id, {
            faqs: project.faqs
        }).then(() => {
            this.setState({
                project: project
            })
        }).catch(err => {
            message.error(err.message);
        });
    }

    submitStory = (values) => {
        this.setState({
            loading: true
        });
        createStory(this.state.project.id, {
            title: values.title,
            details: values.details,
            createdAt: new Date(),
            urls: []
        }, this.state.files).then(story => {
            this.setState({
                stories: [...this.state.stories, story],
                loading: false
            });
        }).catch(err => {
            this.setState({
                loading: false
            });
            message.error(err.message);
        });
    }

    deleteStory = (id) => {
        const { stories, project } = this.state;
        deleteStory(project.id, id).then(() => {
            const index = stories.findIndex(story => story.id===id);
            stories.splice(index, 1);
            this.setState({
                stories: stories
            });
        }).catch(err => {
            message.error(err.message);
        });
    }


    onFileSelect = (e) => {
        const files = e.target.files;
        handleFiles(files, [], 0, 4, (urls) => {
            this.setState({
                files: [...this.state.files, ...files].slice(0, 4),
                images: [...this.state.images, ...urls].slice(0, 4)
            })
        });
    }

    removeFile = (index) => {
        let files = this.state.files;
        let images = this.state.images;
        files.splice(index, 1);
        images.splice(index, 1);
        this.setState({
            files: files,
            images: images
        })
    }


    updateTask = (done, index) => {
        const { project} = this.state;
        project.tasks[index].done = done;
        updateProject(project.id, {
            tasks: project.tasks
        }).then(() => {
            this.setState({
                project: project
            });
        }).catch(err => {
            message.error(err.message);
        })
    }

    removeProject = () => {
        const { project } = this.state;
        deleteProject(project.id).then(() => {
            this.props.history.push("/projects");
        }).catch(err => {
            message.error(err.message);
        })
    }


    render() {
        const { comment, images, project, comments, stories, commentId, contributors, currentUser, loading } = this.state;
        const { i18n, t } = this.props;

        if(!project){
            return loadingView;
        }

        return (
            <div>
                <div className="uk-padding uk-padding-remove-horizontal">

                    <div className="uk-container">
                        { currentUser&&currentUser.uid===vars.admin ?
                            <div className="projects-secondary-background-color uk-padding-small uk-margin-bottom uk-border-rounded">
                                <Row>
                                    <Col>
                                        <h5 className="uk-margin-remove">
                                            <Trans>
                                                You can edit the project details
                                            </Trans>
                                        </h5>
                                    </Col>
                                    <Col className="uk-text-right">
                                        <Link to={`/projects/new?id=${project.id}`} className="uk-margin-small-right small-edit-button">
                                            <Trans>
                                                Edit
                                            </Trans>
                                        </Link>
                                        <Button className="small-delete-button">
                                            <Popconfirm
                                                title={t("Are you sure delete the event?")}
                                                onConfirm={this.removeProject}
                                                okText={t("Delete")}
                                                cancelText={t("Dismiss")}
                                            >
                                                <a>
                                                    <Trans>
                                                        Delete
                                                    </Trans>
                                                </a>
                                            </Popconfirm>
                                        </Button>
                                    </Col>
                                </Row>
                            </div>: null }
                        <Row gutter={window.innerWidth < 768 ? 0 : 8}>
                            <Col sm={24} md={14}>
                                <div uk-slideshow="true">

                                    <div className="uk-visible-toggle uk-light"
                                         tabIndex="-1">
                                        <ul className="uk-slideshow-items">
                                            { project.urls ? project.urls.map(image => (
                                                <li className="uk-text-center">
                                                    <div className="uk-inline">
                                                        <img className="uk-height-large" src={image.url}  onClick={() =>
                                                            UIkit.lightboxPanel({
                                                                items : project.urls.map(image => {
                                                                    return {
                                                                        source: image.url,
                                                                        type: "image",
                                                                        caption: image.name
                                                                    }
                                                                }),
                                                                index: project.urls.indexOf(image)
                                                            }).show()} />
                                                    </div>
                                                </li>
                                            )) : null }
                                        </ul>

                                        <a className="uk-position-center-left uk-position-small uk-hidden-hover"
                                           href="#" uk-slidenav-previous="true"
                                           uk-slideshow-item="previous" />
                                        <a className="uk-position-center-right uk-position-small uk-hidden-hover"
                                           href="#" uk-slidenav-next="true" uk-slideshow-item="next" />

                                    </div>
                                    <ul className="projects-dotnav-color uk-slideshow-nav uk-dotnav uk-flex-center uk-margin" />
                                </div>
                            </Col>
                            <Col sm={24} md={10}>
                                <div className={window.innerWidth > 768 ? "uk-padding" : ""}>
                                    <h5 className="uk-text-bolder uk-text-uppercase projects-color">
                                        { moment(project.deadline.seconds*1000).format("LL") }
                                    </h5>
                                    <h3 className="apple-h2">
                                        { project.title[i18n.language] }
                                    </h3>
                                    <div className="uk-flex uk-margin-top uk-margin-bottom">
                                        <div>
                                            <span>
                                                { moment(project.createdAt.seconds*1000).startOf('seconds').fromNow() }
                                            </span>
                                        </div>
                                    </div>
                                    <Row>
                                        <Col span={12}>
                                            <h4 className="uk-margin-auto-vertical">
                                                <span className="uk-text-bold uk-color-black">
                                                    {project.collected}₸
                                                </span>
                                                <span> <Trans>raised</Trans></span>
                                            </h4>
                                        </Col>
                                        <Col span={12} className="uk-text-right uk-text-bolder">
                                            <h4 className="apple-h3 uk-text-secondary">
                                                {project.total}₸
                                            </h4>
                                        </Col>
                                    </Row>
                                    <Progress percent={parseInt(project.collected*100/project.total)} />

                                    <Row>
                                        <Col span={12}>
                                            <h5 className="uk-text-gray uk-margin-bottom">
                                                {contributors.length} <Trans>donations</Trans>
                                            </h5>
                                        </Col>
                                        <Col span={12} className="uk-text-right uk-text-bolder">
                                            <h5 className="uk-text-gray uk-margin-bottom">
                                                { moment(project.deadline.seconds*1000).fromNow() }
                                            </h5>
                                        </Col>
                                    </Row>
                                    <div className="uk-text-bolder">
                                        <Button size="large" className="projects-background-color uk-width-1-1" style={{ borderRadius: "4px"}} type="primary">
                                            <Trans>
                                                Donate
                                            </Trans>
                                        </Button>
                                    </div>

                                </div>
                            </Col>
                        </Row>
                        <Divider />
                        <Row gutter={16}>
                            <Col sm={24} md={14}>
                                <div className="project-container">
                                    <Tabs type="card">
                                        <TabPane tab={t("Story")} key="1">
                                            <Story loading={loading} currentUser={currentUser} removeFile={this.removeFile} images={images} onFileSelect={this.onFileSelect} details={project.details[i18n.language]} deleteStory={this.deleteStory} stories={stories} submitStory={this.submitStory} />
                                        </TabPane>
                                        <TabPane tab={t("FAQ")} key="2">
                                            <FAQ currentUser={currentUser} deleteFAQ={this.deleteFAQ} faqs={project.faqs} submitFAQ={this.submitFAQ} />
                                        </TabPane>
                                        <TabPane tab={t("Comments")} key="3">
                                            { currentUser&&currentUser.uid ? <CommentEditor count={project.comments} commentId={commentId} cancelEdit={this.cancelEdit} currentUser={currentUser} onSubmit={this.submitComment} comment={comment} onChange={this.handleChange} /> :
                                            <a className="apple-h3 uk-text-emphasis" href="#">
                                                <Trans>
                                                    Comments
                                                </Trans>
                                            </a> }
                                            <br/>
                                            <CommentList
                                                currentUser={currentUser}
                                                editComment={this.editComment}
                                                deleteComment={this.deleteComment}
                                                comments={comments} />
                                        </TabPane>
                                        <TabPane tab={t("Donations")} key="4">
                                            <div className="donations">
                                                <h3 className="apple-h3">
                                                    <Trans>
                                                        Donations
                                                    </Trans>
                                                </h3>

                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={contributors}
                                                    renderItem={item => (
                                                        <List.Item extra={
                                                            <span className="uk-h5 uk-margin-remove donations-color">
                                                            5000₸
                                                        </span>
                                                        }>
                                                            <List.Item.Meta
                                                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                                title={<a href="https://ant.design">{item.title}</a>}
                                                                description={
                                                                    <small className="apple-meta">
                                                                        { moment(new Date()).format("LLL") }
                                                                    </small>
                                                                }
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>

                                        </TabPane>
                                        <TabPane tab={t("Tasks")} key="5">
                                            <List
                                                header={
                                                    <h3 className="apple-h3">
                                                        <Trans>
                                                            Tasks
                                                        </Trans>
                                                    </h3>
                                                }
                                                footer={
                                                    <small className="apple-small project-tasks">
                                                        <Progress percent={(project.tasks.filter(task => task.done).length*100)/project.tasks.length} steps={project.tasks.length} showInfo={false} strokeColor="#0EAD69" /> {project.tasks.filter(task => task.done).length} <Trans>of</Trans> { project.tasks.length } <Trans>tasks are done</Trans>
                                                    </small>
                                                }
                                                dataSource={project.tasks}
                                                renderItem={item => (
                                                    <List.Item className="project-task">
                                                        <Checkbox onChange={() => this.updateTask(!item.done, project.tasks.indexOf(item))} checked={item.done}>
                                                            {item[i18n.language]}
                                                        </Checkbox>
                                                    </List.Item>
                                                )}
                                            />
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Col>
                            <Col sm={24} md={10}>
                                <div className="uk-padding">
                                    <Affix offsetTop={20} className="uk-visible@m">
                                        <div className="uk-background-muted uk-border-rounded uk-padding-small">
                                            <List
                                                header={
                                                    <h3 className="apple-h3">
                                                        <Trans>
                                                            Tasks
                                                        </Trans>
                                                    </h3>
                                                }
                                                footer={
                                                    <small className="apple-small project-tasks">
                                                        <Progress percent={(project.tasks.filter(task => task.done).length*100)/project.tasks.length} steps={project.tasks.length} showInfo={false} strokeColor="#0EAD69" /> {project.tasks.filter(task => task.done).length} <Trans>of</Trans> { project.tasks.length } <Trans>tasks are done</Trans>
                                                    </small>
                                                }
                                                dataSource={project.tasks}
                                                renderItem={item => (
                                                    <List.Item className="project-task">
                                                        <Checkbox onChange={() => this.updateTask(!item.done, project.tasks.indexOf(item))} checked={item.done}>
                                                            {item[i18n.language]}
                                                        </Checkbox>
                                                    </List.Item>
                                                )}
                                            />
                                            <div className="uk-text-bolder uk-margin-top">
                                                <Button size="large" className="projects-background-color uk-width-1-1" style={{ borderRadius: "4px"}} type="primary">
                                                    <Trans>
                                                        Donate
                                                    </Trans>
                                                </Button>
                                            </div>
                                        </div>
                                    </Affix>
                                </div>
                            </Col>
                        </Row>

                    </div>
                </div>
            </div>
        );
    }
}



const CommentList = ({ comments, deleteComment, editComment, currentUser }) => {

    return (
        <div className="events event-comments uk-border-rounded uk-padding-small">
            <Timeline>
                {comments.map(comment => (
                    <Timeline.Item className="comment">
                        <small className="comment-author">
                            {comment.author.name + " · " + moment(comment.createdAt.seconds ? comment.createdAt.seconds*1000 : comment.createdAt).startOf('seconds').fromNow()}
                            { currentUser&&currentUser.uid === comment.author.uid ?
                                <span>
                                <a className="small-delete-button" onClick={() => deleteComment(comment)}>
                                    <Trans>Delete</Trans>
                                </a>
                                <a  className="small-edit-button" onClick={()=> editComment(comment)}>
                                    <Trans>Edit</Trans>
                                </a>
                            </span> : null}
                        </small>
                        <p className="comment-content uk-margin-remove">
                            {comment.body}
                        </p>
                    </Timeline.Item>
                ))}
            </Timeline>
        </div>
    );
}

const CommentEditor = ({ currentUser, onChange, onSubmit, comment, commentId, cancelEdit, count }) => {
    return (
        <div>
            <h4><Trans>Leave your comment</Trans> • {count}</h4>
            { currentUser&&currentUser.uid ? <div>
                <Form.Item className="uk-margin-small-bottom">
                    <TextArea rows={2} onChange={onChange} value={comment} />
                </Form.Item>
                <div className="uk-margin-small-bottom">
                    <Button htmlType="submit" onClick={onSubmit} type="primary" className="projects-background-color">
                        <Trans>
                            Submit
                        </Trans>
                    </Button>
                    { commentId ?
                        <Button onClick={cancelEdit} type="text" className="uk-margin-left">
                            <Trans>
                                Cancel
                            </Trans>
                        </Button>
                        : null }
                </div>
            </div> : null }
        </div>
    );
}

const FAQ = ({ currentUser, faqs, submitFAQ, deleteFAQ }) => {
    const { i18n } = useTranslation();


    return (
        <div className="faq-accordion">
            { currentUser&&currentUser.uid===vars.admin ?
            <ul uk-accordion="true">
                <li>
                    <a className="uk-accordion-title" href="#">
                        <Trans>
                            Frequently asked questions
                        </Trans>
                    </a>
                    <div className="uk-accordion-content uk-padding-small uk-background-muted uk-border-rounded">
                        <div>
                            <Form onFinish={submitFAQ} className="custom-form">
                                <div className="faq-container">
                                    <Tabs type="card">
                                        <TabPane tab="Қазақша" key="1">
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Сұрақты енгізіңіз"
                                                },
                                            ]} name={["title", "kz"]} className="title">
                                                <TextArea placeholder="Сұрақ" autoSize />
                                            </Form.Item>
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Жауап жазыңыз"
                                                },
                                            ]} name={["answer", "kz"]} >
                                                <TextArea placeholder="Жауап" autoSize={{ minRows: 2 }} />
                                            </Form.Item>
                                        </TabPane>
                                        <TabPane tab="English" key="2">
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Enter question"
                                                },
                                            ]} name={["title", "en"]} className="title">
                                                <TextArea placeholder="Question" autoSize />
                                            </Form.Item>
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Write answer"
                                                },
                                            ]} name={["answer", "en"]}>
                                                <TextArea placeholder="Answer" autoSize={{ minRows: 2 }} />
                                            </Form.Item>
                                        </TabPane>
                                        <TabPane tab="Русский" key="3">
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Напишите вопрос"
                                                },
                                            ]} name={["title", "ru"]} className="title">
                                                <TextArea placeholder="Вопрос" autoSize />
                                            </Form.Item>
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Напишите ответ"
                                                },
                                            ]} name={["answer", "ru"]}>
                                                <TextArea placeholder="Ответ" autoSize={{ minRows: 2 }} />
                                            </Form.Item>
                                        </TabPane>
                                    </Tabs>
                                </div>

                                <Form.Item className="uk-margin-top">
                                    <Button htmlType="submit" type="primary" className="projects-background-color">
                                        <Trans>
                                            Submit
                                        </Trans>
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </li>
            </ul> :
            <h3 className="apple-h3 uk-text-emphasis uk-margin-bottom" href="#">
                <Trans>
                    Frequently asked questions
                </Trans>
            </h3>}

            { faqs.map(faq => (
                <div className="margin-bottom">
                    <Row gutter={2}>
                        <Col span={22}>
                            <h5 className="uk-margin-remove">
                                { faq.question[i18n.language]}
                            </h5>
                        </Col>
                        { currentUser&&currentUser.uid===vars.admin ? (
                            <Col span={2}>
                                <div className="uk-position-top-right uk-overlay uk-background-muted uk-border-rounded" style={{ padding: "4px 8px"}}>
                                    <Popconfirm
                                        title={"Are you sure delete the question?"}
                                        onConfirm={() => deleteFAQ(faqs.indexOf(faq))}
                                        okText={"Delete"}
                                        cancelText={"Dismiss"}
                                    >
                                        <a>
                                            <Trans>
                                                Delete
                                            </Trans>
                                        </a>
                                    </Popconfirm>
                                </div>
                            </Col>
                        ) : null }

                    </Row>
                    <p>
                        { faq.answer[i18n.language]}
                    </p>
                </div>
            ))}
        </div>
    )
}

const Story = ({ currentUser, stories, submitStory, deleteStory, details, onFileSelect, images, removeFile, loading }) => {
    const { i18n } = useTranslation();
    const imageView = images.length>0 ? (
        <div>
            <Carousel>
                { images.map(image => (
                    <div className="uk-inline uk-text-center">
                        <img className="uk-height-large" src={image} />
                        <div className="uk-position-top-right uk-overlay uk-border-rounded uk-background-muted" style={{ padding: "5px 8px"}}>
                            <a className="uk-text-danger" onClick={() => removeFile(images.indexOf(image))}>
                                <span className="fas fa-times" />
                            </a>
                        </div>
                    </div>
                ))}
            </Carousel>
            <br/>
        </div>

    ) : null;


    const imagesList = (urls) => {
        if(!urls){
            return null;
        }
        return urls.length>0 ? (
            urls.map(image => (
                <img className="uk-width-1-1 uk-margin-small-top" src={image.url} onClick={() =>
                    UIkit.lightboxPanel({
                        items : urls.map(image => {
                            return {
                                source: image.url,
                                type: "image",
                                caption: image.name
                            }
                        }),
                        index: urls.indexOf(image)
                    }).show()} />
            ))
        ) : null;
    }

    return (
        <div className="faq-accordion">
            { currentUser&&currentUser.uid===vars.admin ?
            <ul uk-accordion="true">
                <li>
                    <a className="uk-accordion-title" href="#">
                        <Trans>
                            Story
                        </Trans>
                    </a>
                    <div className="uk-accordion-content uk-padding-small uk-background-muted uk-border-rounded">
                        <div>
                            <Form onFinish={submitStory} className="custom-form">
                                <div className="faq-container">
                                    { imageView }
                                    <Tabs type="card">
                                        <TabPane tab="Қазақша" key="1">
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Тақырыпты енгізіңіз"
                                                },
                                            ]} name={["title", "kz"]} className="title">
                                                <TextArea placeholder="Тақырып" autoSize />
                                            </Form.Item>
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Мәліметті жазыңыз"
                                                },
                                            ]} name={["details", "kz"]}>
                                                <TextArea placeholder="Мәлімет" autoSize={{ minRows: 2 }} />
                                            </Form.Item>
                                        </TabPane>
                                        <TabPane tab="English" key="2">
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Enter title"
                                                },
                                            ]} name={["title", "en"]} className="title">
                                                <TextArea placeholder="Title" autoSize />
                                            </Form.Item>
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Write details"
                                                },
                                            ]} name={["details", "en"]}>
                                                <TextArea placeholder="Details" autoSize={{ minRows: 2 }} />
                                            </Form.Item>
                                        </TabPane>
                                        <TabPane tab="Русский" key="3">
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Напишите заголовок"
                                                },
                                            ]} name={["title", "ru"]} className="title">
                                                <TextArea placeholder="Заголовок" autoSize />
                                            </Form.Item>
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Напишите подробности"
                                                },
                                            ]} name={["details", "ru"]}>
                                                <TextArea placeholder="Подробности" autoSize={{ minRows: 2 }} />
                                            </Form.Item>
                                        </TabPane>
                                    </Tabs>
                                </div>
                                <Form.Item className="uk-margin-top uk-margin-small-right">
                                    <div uk-form-custom="true">
                                        <Input multiple onChange={onFileSelect} type="file" />
                                        <Button className="uk-button projects-background-color uk-width-1-1 uk-button-small" type="button"
                                                tabIndex="-1">
                                            { images.length>0 ? <Trans>Change</Trans> : <Trans>Upload</Trans>}
                                        </Button>
                                    </div>
                                </Form.Item>
                                <Form.Item className="uk-margin-top">
                                    <Button loading={loading} disabled={loading} htmlType="submit" type="primary" className="projects-background-color">
                                        <Trans>
                                            Submit
                                        </Trans>
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </li>
            </ul> :
            <a className="apple-h3 uk-text-emphasis" href="#">
                <Trans>
                    Story
                </Trans>
            </a>}

            <div className="margin-bottom">
                <div className="uk-text-center uk-margin-small-bottom">
                    <h2 className="apple-h2 uk-margin-remove">
                        <Trans>
                            About Project
                        </Trans>
                    </h2>
                </div>

                <p className="apple-p">
                    { details }
                </p>
            </div>
            { stories.map(story => (
                <div className="margin-bottom">
                    <Divider    />
                    <div className="uk-text-center uk-margin-small-bottom">
                        <Row gutter={2}>
                            <Col span={22}>
                                <div>
                                    <h2 className="apple-h2 uk-margin-remove">
                                        { story.title[i18n.language]}
                                    </h2>
                                    <small className="apple-meta uk-text-muted uk-text-bolder">
                                        { moment(story.createdAt.seconds ? story.createdAt.seconds*1000 : story.createdAt).format("LL")}
                                    </small>
                                </div>
                            </Col>
                            { currentUser.uid===vars.admin ? (
                                <Col span={2}>
                                    <div className="uk-position-top-right uk-overlay uk-background-muted uk-border-rounded" style={{ padding: "4px 8px"}}>
                                        <Popconfirm
                                            title={"Are you sure delete the story?"}
                                            onConfirm={() => deleteStory(story.id)}
                                            okText={"Delete"}
                                            cancelText={"Dismiss"}
                                        >
                                            <a>
                                                <Trans>
                                                    Delete
                                                </Trans>
                                            </a>
                                        </Popconfirm>
                                    </div>
                                </Col>
                            ) : null }
                        </Row>
                    </div>

                    <p className="apple-p">
                        { story.details[i18n.language]}
                    </p>
                    { imagesList(story.urls) }
                </div>
            ))}
        </div>
    )
}

const enhance = compose(
    firebaseConnect(),
    connect()
)

export default enhance(withTranslation()(Project));
