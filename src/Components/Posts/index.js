import React from "react";
import {
    Rate,
    Input,
    Typography,
    Row,
    Col,
    Collapse,
    Avatar,
    List,
    Button,
    Checkbox,
    Tag,
    Affix,
    Menu,
    Dropdown,
    message,
    Form, Drawer
} from 'antd';
import { EllipsisOutlined } from "@ant-design/icons";
import { firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux';
import {Trans, withTranslation} from "react-i18next";
import { compose } from 'redux'
import "../Projects/project.css"
import "./posts.css"
import moment from "moment";
import {addReview, deleteProduct, getProducts, getTags, isSaved, savePost, unsavePost} from "../../functions/post";
import UIkit from "uikit";
import {loadingView, urlify} from "../../functions/helper";
import {Link} from "react-router-dom";
const { Panel } = Collapse;
const { Search, TextArea } = Input;


class AllPosts extends React.Component {
    state = {
        searchText: null,
        posts: [],
        loading: true,
        allLoaded: false,
        currentTag: null,
        tags: [],
        users: [1, 2, 3, 4, 5],
        currentUser: this.props.firebase.auth().currentUser,
    };

    componentDidMount() {
        this.getPosts(null);
        this.getTags()
    }


    getTags = () => {
        getTags().then(tags => {
            this.setState({
                tags: tags
            })
        });
    }


    getPosts = (startAt) => {
        getProducts(startAt, this.state.currentTag, this.state.searchText, null).then(posts => {
            this.setState({
                posts: [...this.state.posts, ...posts],
                loading: false,
                allLoaded: posts.length < 20
            }, () => {
                this.isSaved(posts);
            });
        }).catch(err => {
            this.setState({
                loading: false
            });
        });
    }

    search = (value) => {
        this.setState({
            searchText: value,
            posts: [],
            loading: true,
        }, () => {
            this.getPosts(null);
        })
    };

    changeTag = e => {
        this.setState({
            currentTag: this.state.currentTag===e.target.id ? null : e.target.id,
            loading: true,
            posts: [],
            drawer: false
        }, () => {
            this.getPosts(null);
        });
    };


    loadMore = () => {
        const { posts } = this.state;
        this.setState({
            loading: true
        }, () => {
            this.getPosts(posts[posts.length-1].createdAt);
        });
    }



    deletePost = (id) => {
        const { posts } = this.state;
        deleteProduct(id).then(() => {
            const index = posts.findIndex(post => post.id===id);
            posts.splice(index, 1);
            this.setState({
                posts: posts
            })
        }).catch(err => {
            message.error(err.message);
        })
    }


    isSaved = (posts) => {
        if(this.state.currentUser) {
            posts.forEach((post, i) => {
                isSaved(post.id).then(saved => {
                    posts[i].saved = saved;
                    this.setState({
                        posts: posts
                    })
                });
            })
        }
    }


    savePost = (id) => {
        if(this.state.currentUser) {
            const { posts } = this.state;
            const index = posts.findIndex(post => post.id===id);
            if(posts[index].saved) {
                unsavePost(id).then(() => {
                    posts[index].saved = false;
                    this.setState({
                        posts: posts
                    })
                }).catch(err => {
                    message.error(err.message);
                })
            } else {
                savePost(id).then(() => {
                    posts[index].saved = true;
                    this.setState({
                        posts: posts
                    })
                }).catch(err => {
                    message.error(err.message);
                })
            }
        }
    }


    addReview = (value, uid) => {
        if(this.state.currentUser) {
            const { currentUser } = this.state;
            addReview(uid, {
                rating: value.rating,
                details: value.details ? value.details : null,
                author: {
                    uid: currentUser.uid,
                    name: currentUser.displayName,
                    avatar: currentUser.photoURL
                }
            }).then(() => {
                message.success("Thanks for your review");
            }).catch(err => {
                message.error(err.message);
            });
        }
    }




    render() {
        const { drawer ,searchText, allLoaded, currentTag, loading, tags, posts, users, currentUser } = this.state;
        const { i18n, t } = this.props;


        const tagsView = (
            <div className="posts-tags">
                <div>
                    <Collapse bordered={false} ghost={true}>
                        { tags.filter(tag => tag.parent===null).map(parent => (
                            <Panel header={
                                `${parent.value[i18n.language]} • ${tags.filter(tag => tag.parent===parent.id).length}`
                            } key={parent.id}>
                                <ul className="uk-list">
                                    { tags.filter(tag => tag.parent===parent.id).map(tag => (
                                        <li>
                                            <Checkbox id={tag.id} checked={currentTag===tag.id} onChange={this.changeTag}>
                                                { tag.value[i18n.language] }
                                            </Checkbox>
                                        </li>
                                    ))}
                                </ul>
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            </div>
        );
        return (
            <div className={"uk-container"}>
                <div className={"uk-background-muted" }>
                    <Row gutter={window.innerWidth > 768 ? [8, 8] : [0, 8]}>
                        <Col md={6} sm={24}>
                            <div>
                                <div className="uk-visible@m">
                                    <h4 level={4} className="uk-margin-top uk-text-bold uk-margin-remove-bottom uk-padding-small uk-padding-remove-vertical">
                                        <Trans>
                                            Tags
                                        </Trans>
                                    </h4>
                                    { tagsView }
                                </div>
                            </div>
                        </Col>

                        <Drawer

                            title={t("Tags")}
                            placement="right"
                            closable={true}
                            onClose={() => this.setState({ drawer: !drawer })}
                            visible={drawer}
                            width="100%"
                            className={"phone uk-background-muted"}
                        >
                            { tagsView }
                        </Drawer>
                        <Col md={18} sm={24}>
                            <div className="uk-padding-small posts-border uk-background-default">
                                <Row>
                                    <Col span={20}>
                                        <div>
                                            <Typography.Title level={2} className="uk-text-bold uk-margin-remove">
                                                <Trans>
                                                    Posts
                                                </Trans>
                                            </Typography.Title>
                                        </div>
                                    </Col>
                                    { window.innerWidth < 768 ? (
                                        <Col span={4}>
                                            <div className={"uk-text-right"}>
                                                <Typography.Title onClick={() => this.setState({ drawer: !drawer })} level={3} className="uk-margin-remove">
                                                    <i className={"far fa-list"} />
                                                </Typography.Title>
                                            </div>
                                        </Col>
                                    ) : null }
                                </Row>
                                <h5 level={5} className="section-meta uk-text-muted uk-margin-remove">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                                </h5>

                                <Affix offsetTop={0}>
                                    <div className="uk-padding-small uk-padding-remove-horizontal uk-background-default">
                                        <Row gutter={2}>
                                            <Col flex="auto">
                                                <div>
                                                    <Search
                                                        placeholder={t("Search posts")}
                                                        onSearch={this.search}
                                                    />
                                                </div>
                                            </Col>
                                            { currentUser ? (
                                                <Col span={4}>
                                                    <div className="uk-width-1-1">
                                                        <Link to={"/posts/new"} className="uk-width-1-1" >
                                                            <Button type="primary" className={"uk-width-1-1 auth-background-color"}>
                                                                <Trans>
                                                                    Add
                                                                </Trans>
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </Col>
                                            ) : null }
                                        </Row>


                                        { tags.find(tag => tag.id===currentTag) ?
                                            <div className="uk-margin-small-top">
                                                <Tag.CheckableTag checked={true} onChange={() => this.changeTag({ target: { id: currentTag }})}>
                                                    <h6 className="uk-h5 uk-margin-remove white-color">
                                                        { tags.find(tag => tag.id===currentTag).value[i18n.language] }
                                                    </h6>
                                                </Tag.CheckableTag>
                                            </div>
                                            : null }
                                    </div>
                                </Affix>


                                <div className="posts-list">
                                    <List
                                        itemLayout="vertical"
                                        dataSource={posts}
                                        renderItem={item => (
                                            <List.Item
                                                key={item.title}
                                                actions={ currentUser ? [
                                                    <a className="uk-link-heading" onClick={() => this.savePost(item.id)}>
                                                        { !item.saved ?
                                                            <div>
                                                                <span className="far fa-bookmark" /> <Trans>Save</Trans>
                                                            </div>
                                                        :
                                                            <div className="auth-color">
                                                                <span className="fas fa-bookmark" /> <Trans>Saved</Trans>
                                                            </div>
                                                        }
                                                    </a>,
                                                    <Link to={`/chats?id=${currentUser.uid < item.author.uid ? currentUser.uid+item.author.uid : item.author.uid+currentUser.uid}`} className="uk-link-heading">
                                                        <span uk-icon={"commenting"} /> <Trans>Message</Trans>
                                                    </Link>
                                                ] : []}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar src={item.author.avatar} />}
                                                    title={
                                                        <div>
                                                            <Row gutter={2}>
                                                                <Col span={22}>
                                                                    <div>
                                                                        <h6 className="uk-margin-remove">
                                                                            <a className="uk-link-heading" href={item.href}>
                                                                                {item.author.name}
                                                                            </a>
                                                                        </h6>
                                                                        <small className="uk-text-muted">
                                                                            { item.updatedAt ? `${t("Updated at")} ${moment(item.updatedAt.seconds * 1000).format("LLL")}` : moment(item.createdAt.seconds * 1000).format("LLL") } • { tags.find(tag => tag.id===item.topic) ? tags.find(tag => tag.id===item.topic).value[i18n.language] : null }
                                                                        </small>
                                                                    </div>
                                                                </Col>
                                                                { currentUser&&currentUser.uid===item.author.uid ? (
                                                                    <Col span={2}>
                                                                        <div className="uk-text-right">
                                                                            <Dropdown placement="bottomRight" overlay={
                                                                                <Menu>
                                                                                    <Menu.Item>
                                                                                        <Link to={`/posts/new?id=${item.id}`}>
                                                                                            <Trans>
                                                                                                <span uk-icon="pencil"/> <Trans>Edit</Trans>
                                                                                            </Trans>
                                                                                        </Link>
                                                                                    </Menu.Item>
                                                                                    <Menu.Item className="uk-text-danger" danger onClick={() => this.deletePost(item.id)}>
                                                                                        <Trans>
                                                                                            <span uk-icon="trash"/> <Trans>Delete</Trans>
                                                                                        </Trans>
                                                                                    </Menu.Item>
                                                                                </Menu>
                                                                            }>
                                                                                <Button shape="circle" icon={<EllipsisOutlined />} />
                                                                            </Dropdown>
                                                                        </div>
                                                                    </Col>
                                                                ) : null }
                                                            </Row>
                                                        </div>
                                                    }
                                                />
                                                <h5 className="uk-margin-remove">
                                                    {item.title} {item.price ? ` • ${item.price}₸` : null}
                                                </h5>
                                                <Typography.Paragraph ellipsis={{ expandable: true, rows: 3}} className="uk-margin-remove-bottom">
                                                    { item.details ? urlify(item.details).text : null }
                                                </Typography.Paragraph>
                                                { item.details ? urlify(item.details).urls.map(url => (
                                                    <a href={url}>
                                                        <span uk-icon={"link"}/> {url.replace('http://','').replace('https://','').split(/[/?#]/)[0]}
                                                    </a>
                                                )) : null }
                                                { item.urls.length > 0 ?
                                                    <div uk-slideshow="true">
                                                        <div className="uk-position-relative uk-visible-toggle uk-light"
                                                             tabIndex="-1">
                                                            <ul className="uk-slideshow-items">
                                                                { item.urls.map(image => (
                                                                    <li className="uk-text-center uk-background-muted">
                                                                        <img className="uk-border-rounded uk-height-large" src={image.url}  onClick={() =>
                                                                            UIkit.lightboxPanel({
                                                                                items : item.urls.map(image => {
                                                                                    return {
                                                                                        source: image.url,
                                                                                        type: "image",
                                                                                        caption: image.name
                                                                                    }
                                                                                }),
                                                                                index: item.urls.indexOf(image)
                                                                            }).show()} />
                                                                    </li>
                                                                )) }
                                                            </ul>

                                                            <a className="uk-position-center-left uk-position-small uk-hidden-hover"
                                                               href="#" uk-slidenav-previous="true"
                                                               uk-slideshow-item="previous" />
                                                            <a className="uk-position-center-right uk-position-small uk-hidden-hover"
                                                               href="#" uk-slidenav-next="true" uk-slideshow-item="next" />

                                                        </div>
                                                    </div>
                                                    : null }

                                            </List.Item>
                                        )}
                                    />
                                </div>
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
export default enhance(withTranslation()(AllPosts));
