import {
    Popconfirm, List, Row, Col, Typography, Avatar, Timeline, Divider, Form, Button, Input, notification, Spin, message
} from "antd";
import React from "react";
import moment from "moment";
import {Trans, useTranslation} from "react-i18next";
import UIkit from "uikit"
import {connect} from "react-redux";
import {
    joinEvent,
    leaveEvent,
    deleteEvent,
    getComments,
    getMembers,
    getEvent,
    getTopics, isJoined, uploadEventImages, updateEvent,
    createComment, updateComment, deleteComment
} from "../../functions/event";
import {withTranslation} from "react-i18next";
import {handleFiles} from "../Helper/Handler";
import {compose} from "redux";
import { firestoreConnect} from "react-redux-firebase";
import {loadingView} from "../../functions/helper";
import {Link} from "react-router-dom";
import vars from "../../config/vars.json"
const { TextArea } = Input;


const MembersView = ({ members}) => {
    const { t } = useTranslation();

    return (
        <div>
            <List
                dataSource={members}
                className="event-members"
                renderItem={member => (
                    <List.Item>
                        <h5 className="uk-margin-remove">
                            <Avatar src={member.avatar} className="uk-margin-small-right" />
                            <span className="uk-text-middle">{member.name}</span>
                        </h5>
                    </List.Item>
                )}
            />
        </div>
    );
}

const ImagesView = ({ currentUser, submitting, urls, previews, uploadImage, removeFile, handleSelect, removeImage}) => {
    const { t } = useTranslation();

    return (
        <div>
            <Row>
                <Col span={12} className="uk-padding-small uk-padding-remove-horizontal">
                    <h3 className="apple-h3 uk-margin-remove">
                        <Trans>Gallery</Trans> • {urls.length}
                    </h3>
                </Col>
                { currentUser&&currentUser.uid===vars.admin ? <Col span={12} className="uk-text-right uk-padding-small uk-flex uk-flex-middle">
                    { previews.length > 0 ?
                        <button onClick={uploadImage} className="uk-button uk-button-secondary uk-border-pill uk-button-xsmall events-background-color uk-margin-small-right" type="button">
                            { submitting ? <span uk-spinner="ratio: 0.5"> <Trans>Uploading</Trans></span> : <span><Trans>Upload all</Trans></span>}
                        </button>
                        : null
                    }
                    <div uk-form-custom="true">
                        <input multiple onChange={handleSelect} type="file"  />
                        <button className="uk-button uk-button-default uk-border-pill uk-button-xsmall" type="button"
                                tabIndex="-1">
                            <i className="fas fa-upload" /> <Trans>Choose</Trans>
                        </button>
                    </div>
                </Col> : null}

            </Row>

            <Row gutter={[8, 8]}>

                { previews.length>0 ?
                    previews.map(preview => (
                        <Col sm={24} md={12}  className="uk-text-center">
                            <div>
                                <a className="uk-inline uk-border-rounded uk-background-default  uk-height-medium">
                                    <div className="">
                                        <img className="uk-width-1-1  uk-height-medium" src={preview}  />
                                        <div className="uk-position-top-right uk-overlay uk-border-rounded uk-background-muted" style={{ padding: "4px 8px"}}>
                                            <a onClick={() => removeImage(previews.indexOf(preview))} className="uk-text-danger">
                                                <Trans>Delete</Trans>
                                            </a>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </Col>
                    ))
                    :
                    null
                }


                { urls.map(image => (
                    <Col sm={24} md={12}  className="uk-text-center">
                        <div>
                            <a className="uk-inline uk-border-rounded uk-background-default  uk-height-medium">
                                <div className="">
                                    <img className="uk-width-1-1  uk-height-medium" src={image.url}  onClick={() =>
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
                                    { currentUser&&currentUser.uid===vars.admin ?
                                        <div className="uk-position-top-right uk-overlay uk-border-rounded uk-background-muted" style={{ padding: "4px 8px"}}>
                                            <Popconfirm
                                                title={t("Are you sure to delete the image?")}
                                                onConfirm={() => removeImage(urls.indexOf(image))}
                                                okText={t("Delete")}
                                                cancelText={t("Dismiss")}
                                            >
                                                <a className="uk-text-danger">
                                                    <span className="fas fa-times" />
                                                </a>
                                            </Popconfirm>
                                        </div>
                                        : null }
                                </div>
                            </a>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
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
                    <Button htmlType="submit" onClick={onSubmit} type="primary" className="events-background-color">
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



class Event extends React.Component {


    state = {
        comment: "",
        commentId: null,
        files: [],
        previews: [],
        event: null,
        comments: [],
        members: [],
        loading: false,
        currentUser: this.props.firebase.auth().currentUser,
        isJoined: false,
        uploading: false
    }


    componentDidMount() {
        this.getEvent();
        this.getTopics();
        this.getComments();
        this.getMembers();
        this.isJoined()
    }


    isJoined = () => {
        const { currentUser } = this.state;
        if(currentUser&&currentUser.uid) {
            isJoined(this.props.match.params.id).then(isJoined => {
                this.setState({
                    isJoined: isJoined
                })
            })
        }
    }

    getEvent = () => {
        getEvent(this.props.match.params.id).then(event => {
            this.setState({
                event: event,
                loading: false
            })
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }

    getTopics = () => {
        getTopics().then(topics => {
            this.setState({
                topics: topics
            })
        });
    }

    getMembers = () => {
        getMembers(this.props.match.params.id).then(members => {
            this.setState({
                members: members
            })
        });
    }

    getComments = () => {
        getComments(this.props.match.params.id).then(comments => {
            this.setState({
                comments: comments
            })
        });
    }


    handleSelect = (e) => {
        const files = e.target.files;
        handleFiles(files, [], 0, 4, (urls) => {
            this.setState({
                files: [...this.state.files, ...files].slice(0, 4),
                previews: [...this.state.previews, ...urls].slice(0, 4)
            })
        });
    }

    removeFile = (index) => {
        let files = this.state.files;
        let previews = this.state.previews;
        files.splice(index, 1);
        previews.splice(index, 1);
        this.setState({
            files: files,
            previews: previews
        })
    }

    uploadImage = (e) => {
        const { files, event, uploading } = this.state;
        if(files.length===0 && !uploading){
            this.showNotification("Error", "Please choose an image")
            return;
        }
        this.setState({
            uploading: true
        });
        uploadEventImages(event, files).then(event => {
            this.setState({
                uploading: false,
                files: [],
                previews: [],
                event: event
            });
        }).catch(err => {
            this.setState({
                uploading: false
            });
            message.error(err.message);
        });
    }

    submitComment = () => {
        const { currentUser, event, commentId, comment, comments } = this.state;
        if (!comment || !currentUser || !currentUser.uid) {
            return;
        }
        if(commentId) {
            updateComment(event.id, comment, commentId).then(() => {
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
            createComment(event.id, newComment).then(doc => {
                newComment.id = doc.id;
                this.setState({
                    comment: "",
                    comments: [...comments, newComment],
                    commentId: null,
                    event: {
                        ...event,
                        comments: event.comments + 1
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
        const { comments, event } = this.state;
        const { currentUser } = this.state;
        if(currentUser&&currentUser.uid) {
            deleteComment(event.id, comment.id).then(() => {
                const index = comments.findIndex(item => comment.id===item.id);
                comments.splice(index, 1);
                this.setState({
                    comment: "",
                    comments: comments,
                    event: {
                        ...event,
                        comments: event.comments - 1
                    }
                })
            }).catch(err => {
                message.error(err.message);
            });
        }
    }

    handleChange = e => {
        this.setState({
            comment: e.target.value
        })
    };


    removeImage = (index) => {
        const { event } = this.state;
        event.urls.splice(index, 1);
        updateEvent(event.id, { urls: event.urls }).then(() => {
            this.setState({
                event: event
            })
        }).catch(err => {
            message.error(err.message);
        });
    }

    participate = () => {
        const { isJoined, event, members } = this.state;
        const { currentUser } = this.state;
        if(currentUser&&currentUser.uid) {
            if(isJoined){
                leaveEvent(event.id).then(() => {
                    const index = members.findIndex(member => member.uid===currentUser.uid);
                    members.splice(index, 1);
                    this.setState({
                        members: members,
                        events: {
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
                    members.push({
                        id: currentUser.uid,
                        uid: currentUser.uid,
                        name: currentUser.displayName,
                        avatar: currentUser.photoURL,
                    });
                    this.setState({
                        members: members,
                        events: {
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
    }

    removeEvent = () => {
        const { event } = this.state;
        deleteEvent(event.id).then(() => {
            this.props.history.push("/events");
        }).catch(err => {
            message.error(err.message);
        })
    }


    render(){
        const { i18n, t } = this.props;
        const { previews, comment, event, currentUser, comments, members, isJoined, uploading, commentId } = this.state;
        const { submitComment, editComment, handleChange, showNotification } = this;

        if(!event){
            return loadingView;
        }

        return(
            <Row className="uk-margin-bottom uk-margin-top">
                <Col sm={24} md={16} className="uk-border-right">
                    <div className={ window.innerWidth > 768 ? "uk-padding" : "uk-padding-small"}>
                        { currentUser&&currentUser.uid===vars.admin ?
                        <div className="event-secondary-background-color uk-padding-small uk-margin-bottom uk-border-rounded">
                            <Row>
                                <Col>
                                    <h5 className="uk-margin-remove">
                                        <Trans>
                                            You can edit the event details
                                        </Trans>
                                    </h5>
                                </Col>
                                <Col className="uk-text-right">
                                    <Link to={`/events/new?id=${event.id}`} className="uk-margin-small-right small-edit-button">
                                        <Trans>
                                            Edit
                                        </Trans>
                                    </Link>
                                    <Button className="small-delete-button">
                                        <Popconfirm
                                            title={t("Are you sure delete the event?")}
                                            onConfirm={this.removeEvent}
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


                        <h5 id={event.id} className="uk-text-uppercase events-color">
                            <Trans>
                                { moment(event.date*1000).format("MMMM D, HH:mm")}
                            </Trans>
                        </h5>
                        <h3 className="apple-h2">
                            { event.title[i18n.language] }
                        </h3>
                        <ul className="uk-grid-small uk-child-width-auto" uk-grid="true">
                            { event.link ?
                                <li>
                                    <a target="_blank" href={event.link} className="uk-button-text">
                                        <i className="events-color fas fa-link" /> <Trans>Register</Trans>
                                    </a>
                                </li>
                                : null }
                            <li className="uk-text-secondary">
                                <i className="events-color fas fa-map-marker-alt" /> {event.location[i18n.language]}
                            </li>
                        </ul>


                        <p className="events-details">
                            <Typography.Paragraph className="apple-p">
                                { event.details[i18n.language] }
                            </Typography.Paragraph>
                        </p>


                        { currentUser&&currentUser.uid ?
                        <div className="uk-margin-top">
                            { isJoined ?
                                <Popconfirm
                                    title={t("Leave the event?")}
                                    onConfirm={this.participate}
                                    okText={t("Leave")}
                                    cancelText={t("Dismiss")}
                                >
                                    <Button type="danger">
                                        <Trans>Leave the event</Trans>
                                    </Button>
                                </Popconfirm>
                                :
                                <Button type={"primary"} className="events-background-color" onClick={this.participate}>
                                    <Trans>Join the event</Trans>
                                </Button>
                            }
                        </div>
                        : null }


                        <Divider />


                        <div className="uk-margin-small-top" id="images-list">
                            <ImagesView currentUser={currentUser}
                                        submitting={uploading}
                                        urls={event.urls}
                                        removeFile={this.removeFile}
                                        handleSelect={this.handleSelect}
                                        previews={previews}
                                        removeImage={this.removeImage}
                                        uploadImage={this.uploadImage} />
                        </div>

                        <Divider />

                        <div>
                            <div className="uk-margin-small-top" id="comments-list">
                                { currentUser&&currentUser.uid ?
                                    <CommentEditor count={event.comments} commentId={commentId} cancelEdit={this.cancelEdit} currentUser={currentUser} onSubmit={this.submitComment} comment={comment} onChange={this.handleChange} />
                                : <h4 className="uk-text-uppercase">
                                        <Trans>
                                            {event.comments} comments
                                        </Trans>
                                </h4>}

                                <div className="uk-margin-top">
                                    <CommentList
                                        currentUser={currentUser}
                                        editComment={this.editComment}
                                        deleteComment={this.deleteComment}
                                        comments={comments} />
                                </div>
                            </div>
                        </div>

                    </div>
                </Col>


                <Col sm={24} md={8} className="uk-padding-small">
                    <h4 className="uk-text-uppercase">
                        <Trans>
                            members • {event.members}
                        </Trans>
                    </h4>
                    <MembersView members={members} />
                </Col>


            </Row>
        );
    }
}

const enhance = compose(
    firestoreConnect(),
    connect()
)

export default enhance(withTranslation()(Event));
