import React from "react";
import {
    Timeline,
    List,
    Typography,
    Row,
    Col,
    Divider,
    Form,
    Button,
    Input,
    Popconfirm,
    message,
    Space
} from 'antd';
import moment from 'moment';
import "./news.css"
import {
    likePost,
    deletePost,
    createComment,
    updateComment,
    deleteComment,
    isLiked,
    getComments,
    getPost,
    getTopics
} from "../../functions/news";
import { Editor, convertFromRaw, EditorState} from "draft-js";
import {compose} from "redux";
import {Link} from "react-router-dom";
import {firestoreConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import { Trans, withTranslation} from "react-i18next";
import UIkit from "uikit";
import { loadingView } from "../../functions/helper"
import vars from "../../config/vars.json";
const { TextArea } = Input;


class NewsPost extends React.Component {

    state = {
        comment: "",
        commentId: null,
        comments: [],
        post: null,
        liked: false,
        currentUser: this.props.firebase.auth().currentUser,
        topics: []
    };

    componentDidMount = () => {
        this.loadPost();
        this.loadComments(null);
        this.getTopics();
        this.isLiked();
    }

    loadPost = () => {
        getPost(this.props.match.params.id).then(post => {
            this.setState({
                post: post
            });
        }).catch(err => {
            message.error(err.message);
        })
    }

    getTopics = () => {
        getTopics().then(topics => {
            this.setState({
                topics: topics
            });
        }).catch(err => {
            message.error(err.message);
        })
    }

    loadComments = () => {
        getComments(this.props.match.params.id).then(comments => {
            this.setState({
                comments: comments
            });
        }).catch(err => {
            message.error(err.message);
        })
    }

    isLiked = () => {
        const { currentUser } = this.state;
        if (!currentUser || !currentUser.uid) {
            return;
        }
        isLiked(this.props.match.params.id, currentUser.uid).then(isLiked => {
            this.setState({
                isLiked: isLiked
            })
        }).catch(err => {
            message.error(err.message);
        })
    }


    submitComment = () => {
        const { currentUser, post, commentId, comment, comments } = this.state;
        if (!comment || !currentUser || !currentUser.uid) {
            return;
        }
        if(commentId) {
            updateComment(post.id, comment, commentId).then(() => {
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
            createComment(post.id, newComment).then(doc => {
                newComment.id = doc.id;
                this.setState({
                    comment: "",
                    comments: [...comments, newComment],
                    commentId: null,
                    post: {
                        ...post,
                        comments: post.comments + 1
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
        const { comments, post, currentUser } = this.state;
        if(currentUser&&currentUser.uid) {
            deleteComment(post.id, comment.id).then(() => {
                const index = comments.findIndex(item => comment.id===item.id);
                comments.splice(index, 1);
                this.setState({
                    comment: "",
                    comments: comments,
                    post: {
                        ...post,
                        comments: post.comments - 1
                    }
                })
            }).catch(err => {
                message.error(err.message);
            });
        }

    }

    likePost = (e) => {
        const { post, currentUser, isLiked } = this.state;
        if(currentUser&&currentUser.uid) {
            likePost(post.id, !isLiked, currentUser).then(() => {
                this.setState({
                    isLiked: !isLiked,
                    post: {
                        ...post,
                        likes: isLiked ? post.likes - 1 : post.likes + 1
                    }
                });
            }).catch(err => {
                message.error(err.message);
            });
        }
    }

    handleChange = e => {
        this.setState({
            comment: e.target.value,
        });
    };

    deletePost = () => {
        deletePost(this.state.post.id).then(() => {
            this.props.history.push("/news");
        }).catch(err => {
            message.error(err.message);
        });
    }


    render() {
        const { topics, comment, comments, post, isLiked, currentUser, commentId } = this.state;
        const { i18n, t } = this.props;

        if(!post){
            return loadingView;
        }

        return (
            <div>
                <div className="uk-padding uk-padding-remove-horizontal">

                    <div className="uk-container uk-container-expand">
                        <Row gutter={8}>

                            <Col sm={24} md={18}>
                                { currentUser&&currentUser.uid===vars.admin ?
                                <div className="news-secondary-background-color uk-padding-small uk-margin-bottom uk-border-rounded">
                                    <Row>
                                        <Col>
                                            <h5 className="uk-margin-remove">
                                                <Trans>
                                                    You can edit the post details
                                                </Trans>
                                            </h5>
                                        </Col>
                                        <Col className="uk-text-right">
                                            <Link to={`/news/new?id=${post.id}`} className="uk-margin-small-right small-edit-button">
                                                <Trans>
                                                    Edit
                                                </Trans>
                                            </Link>
                                            <Button className="small-delete-button">
                                                <Popconfirm
                                                    title={t("Are you sure delete the post?")}
                                                    onConfirm={this.deletePost}
                                                    okText={t("Delete")}
                                                    cancelText={t("Dismiss")}
                                                >
                                                    <a>
                                                        <Trans>Delete</Trans>
                                                    </a>
                                                </Popconfirm>
                                            </Button>
                                        </Col>
                                    </Row>
                                </div> : null }

                                <h5 className="uk-text-bolder news-color">
                                    { topics.find(topic => topic.id===post.topic) ? topics.find(topic => topic.id===post.topic)[i18n.language] : null}
                                </h5>
                                <Typography.Title level={2} className="section-headeruk-text-bold uk-margin-small-bottom">
                                    { post.title[i18n.language]}
                                </Typography.Title>
                                <p>
                                    { moment(post.createdAt.seconds*1000).fromNow()}
                                </p>
                                <div uk-slideshow="true">

                                    <div className="uk-position-relative uk-visible-toggle uk-light"
                                         tabIndex="-1">
                                        <ul className="uk-slideshow-items">
                                            { post.urls ? post.urls.map(image => (
                                                <li className="uk-text-center uk-background-muted">
                                                    <div className="uk-inline">
                                                        <img src={image.url}  onClick={() =>
                                                            UIkit.lightboxPanel({
                                                                items : post.urls.map(image => {
                                                                    return {
                                                                        source: image.url,
                                                                        type: "image",
                                                                        caption: image.name
                                                                    }
                                                                }),
                                                                index: post.urls.indexOf(image)
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
                                    <ul className="news-dotnav-color uk-slideshow-nav uk-dotnav uk-flex-center uk-margin" />
                                </div>



                                <div className="uk-margin-top uk-margin-bottom">

                                    <Typography.Paragraph className="uk-text-emphasis" style={{ fontSize: "18px"}}>
                                        { post ? <Editor
                                            editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(post.details[i18n.language])))}
                                            readOnly={true}
                                        /> : null}
                                    </Typography.Paragraph>


                                    <div className="uk-grid-small uk-child-width-auto" uk-grid="true">
                                        <a onClick={this.likePost}>
                                            <Button icon={<i className="fas fa-thumbs-up" />} shape="round" type="primary" className={
                                                isLiked ? "uk-news-button" : "uk-news-button-outline"}>
                                                { post.likes }
                                            </Button>
                                        </a>
                                    </div>
                                    <div className="uk-margin-small-top">
                                        <CommentEditor
                                            currentUser={currentUser}
                                            onChange={this.handleChange}
                                            onSubmit={this.submitComment}
                                            comment={comment}
                                            count={post.comments}
                                            commentId={commentId}
                                            cancelEdit={this.cancelEdit}
                                        />
                                        {comments.length > 0 && <CommentList onDelete={this.deleteComment} currentUser={currentUser} editComment={this.editComment} id={post.id} comments={comments} />}
                                    </div>
                                </div>
                            </Col>
                            <Col sm={24} md={6}>
                                <div className="uk-visible@m uk-padding-small uk-background-muted uk-border-rounded">
                                    <Typography.Title level={3} className="uk-margin-remove-bottom">
                                        <Trans>
                                            Tags
                                        </Trans>
                                    </Typography.Title>
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
                                                <Link to={`/news?topic=${item.id}`} className="uk-width-1-1">
                                                    <Row className="uk-width-1-1 uk-text-secondary">
                                                        <Col span={20}>
                                                            {item[i18n.language]}
                                                        </Col>
                                                        <Col span={4} className="uk-text-right">
                                                            <span className="fas fa-chevron-right" />
                                                        </Col>
                                                    </Row>
                                                </Link>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}


const CommentList = ({ comments, id, editComment, currentUser, onDelete }) => (
    <Timeline className="uk-margin-top news-comments">
        {comments.map(comment => (
            <Timeline.Item className="comment">
                <small className="comment-author">
                    {comment.author.name + " · " + moment(comment.createdAt.seconds ? comment.createdAt.seconds*1000 : comment.createdAt).startOf('seconds').fromNow()}
                    { currentUser&&currentUser.uid === comment.author.uid ? <span>
                        <a className="small-delete-button" onClick={() => onDelete(comment)}>
                            <Trans>Delete</Trans>
                        </a>
                        <a className="small-edit-button" onClick={()=> editComment(comment)}>
                            <Trans>Edit</Trans>
                        </a>
                    </span> : null}
                </small>
                <p className="comment-content">
                    {comment.body}
                </p>
            </Timeline.Item>
        ))}
    </Timeline>
);

const CommentEditor = ({ currentUser, onChange, onSubmit, comment, count, commentId, cancelEdit }) => (
    <div>
        <Divider />
        <h4><Trans>Leave your comment</Trans> • {count}</h4>
        { currentUser&&currentUser.uid ?
            <div>
                <Form.Item className="uk-margin-small-bottom">
                    <TextArea rows={3} onChange={onChange} value={comment} />
                </Form.Item>
                <div className="uk-margin-small-bottom">
                    <Button htmlType="submit" onClick={onSubmit} type="primary" className="news-background-color">
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
            </div>
        : null }
    </div>
);


const enhance = compose(
    firestoreConnect(),
    connect(() => {})
)

export default enhance(withTranslation()(NewsPost));
