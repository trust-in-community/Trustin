import React from "react";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {Trans, withTranslation} from "react-i18next";
import {
    Avatar,
    Col,
    Row,
    Typography,
    Tag,
    message,
    Affix,
    Button,
    List,
    Form,
    Rate,
    Dropdown,
    Menu,
    Input,
    Timeline,
    Select, DatePicker,
    Table, Badge, Space
} from "antd";
import {getUser} from "../../functions/chat";
import {addReview, deleteProduct, getProducts, getTags, isSaved, savePost, unsavePost} from "../../functions/post";
import {getIcon, loadingView, urlify} from "../../functions/helper";
import "./index.css"
import {Link} from "react-router-dom";
import moment from "moment";
import {EllipsisOutlined} from "@ant-design/icons";
import UIkit from "uikit";
import {getSaved, updateProfile, updateUser} from "../../functions/user";
import {handleFiles} from "../Helper/Handler";
import Shop from "./Shop";
import Account from "./Account";
const { Search, TextArea } = Input;
const { Option, OptGroup } = Select;
const layout = {
    labelCol: { span : 24 },
    wrapperCol: { span: 24 }
}

class Index extends React.Component {

    state = {
        searchText: null,
        posts: [],
        user: null,
        currentUser: this.props.firebase.auth().currentUser,
        tags: [],
        loading: true,
        postsLoading: true,
        allLoaded: false,
        currentTag: null,
        currentView: "posts",
        saved: [],
        reviews: [],
        file: null,
        profile_url: null
    }



    componentDidMount() {
        getUser(this.props.match.params.id).then(user => {
            this.setState({
                user: user,
                loading: false,
                profile_url: user.info.avatar
            }, () => {
                this.getPosts(null);
                this.getSaved();
            })
        });
        this.getTags();
    }


    getTags = () => {
        getTags().then(tags => {
            this.setState({
                tags: tags
            })
        });
    }


    getSaved = () => {
        const { user, currentUser } = this.state;
        if(user.id === currentUser.uid) {
            getSaved().then(saved => {
                console.log(saved);
                this.setState({
                    saved: saved
                });
            });
        }
    }


    changeView = (view) => {
        this.setState({
            currentView: view
        })
    }

    getPosts = (startAt) => {
        getProducts(startAt, this.state.currentTag, this.state.searchText, this.state.user.id).then(posts => {
            this.setState({
                posts: [...this.state.posts, ...posts],
                postsLoading: false,
                allLoaded: posts.length < 20
            }, () => {
                this.isSaved(posts);
            });
        }).catch(err => {
            console.log(err);
            this.setState({
                postsLoading: false
            });
        });
    }

    search = (value) => {
        this.setState({
            searchText: value,
            posts: [],
            postsLoading: true,
        }, () => {
            this.getPosts(null);
        })
    };


    changeTag = id => {
        this.setState({
            currentTag: this.state.currentTag===id ? null : id,
            postsLoading: true,
            posts: []
        }, () => {
            this.getPosts(null);
        });
    };


    loadMore = () => {
        const { posts } = this.state;
        this.setState({
            postsLoading: true
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
        posts.forEach((post, i) => {
            isSaved(post.id).then(saved => {
                posts[i].saved = saved;
                this.setState({
                    posts: posts
                })
            });
        })
    }


    savePost = (id) => {
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



    render() {
        const { saved, user, allLoaded, currentTag, loading, tags, posts, currentUser, postsLoading, currentView } = this.state;
        const { i18n, t } = this.props;

        if(loading || !user) return loadingView;



        const view = () => {
            switch (currentView){
                case "account":
                    return <Account {...this.props} user={user} tags={tags} />
                case "saved":
                    return (<div>

                        <div className="posts-list">
                            <List
                                itemLayout="vertical"
                                dataSource={saved}
                                renderItem={item => (
                                    <List.Item
                                        key={item.title}
                                        actions={ currentUser ? [
                                            <a className="uk-link-heading" onClick={() => this.savePost(item.id)}>
                                                <div className="auth-color">
                                                    <span className="fas fa-bookmark" /> <Trans>Saved</Trans>
                                                </div>
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
                                                        <Col flex={"auto"}>
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
                        { postsLoading ? loadingView :
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
                    </div>);
                case "orders":
                    return <Shop {...this.props}/>;
                default:
                    return (<div>
                        <Affix offsetTop={0}>
                            <div className="uk-padding-small uk-padding-remove-horizontal uk-background-default">
                                <div>
                                    <Search
                                        className={"uk-width-1-1"}
                                        placeholder={t("Search posts")}
                                        onSearch={this.search}
                                    />
                                </div>


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
                                        actions={ currentUser&&currentUser.uid!==user.id ? [
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
                                                        <Col flex={"auto"}>
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
                        { postsLoading ? loadingView :
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
                    </div>);
            }
        }

        return (
            <div className="uk-background-muted">
                <div className="uk-container uk-background-default">
                    <div>
                        <Row gutter={[ 8, 8 ]}>
                            <Col sm={24} md={8}>
                                <div className="user-info">
                                    <div className="uk-text-center">
                                        <img src={user.info.avatar} className="uk-height-medium uk-width-medium uk-border-circle uk-margin-auto" onClick={() =>
                                            UIkit.lightboxPanel({
                                                items : [{
                                                    source: user.info.avatar,
                                                    type: "image",
                                                    caption: `${user.info.first_name} ${user.info.second_name}`
                                                }]
                                            }).show()}  />
                                    </div>

                                    <div className="uk-padding-small uk-border-rounded">
                                        <h4 className="auth-color uk-text-center">
                                            {user.info.name}
                                        </h4>
                                        <p className="apple-small uk-text-center uk-text-muted uk-margin-small-bottom">
                                            { t(user.status).toUpperCase() }
                                        </p>
                                        { currentUser.uid!==user.id ? (
                                            <Link to={`/chats?id=${currentUser.uid < user.id ? currentUser.uid+user.id : user.id+currentUser.uid}`}>
                                                <Button block>
                                                    <Trans>
                                                        Message
                                                    </Trans>
                                                </Button>
                                            </Link>
                                        ) : null }
                                    </div>

                                    <hr className="uk-margin-remove"/>

                                    <div className="uk-padding-small">
                                        <h5 className="uk-h5 uk-margin-remove">
                                            <Trans>
                                                General
                                            </Trans>
                                        </h5>
                                        <dl className="uk-description-list uk-margin-small-top">
                                            <dt>
                                                <Trans>
                                                    Email
                                                </Trans>
                                            </dt>
                                            <dd>
                                                { user.static.email }
                                            </dd>
                                            <dt>
                                                <Trans>
                                                    About
                                                </Trans>
                                            </dt>
                                            <dd>
                                                <Typography.Paragraph className="uk-margin-remove" ellipsis={{ expandable: true, rows: 3}}>
                                                    { user.info.about }
                                                </Typography.Paragraph>
                                            </dd>
                                            <dt>
                                                <Trans>
                                                    Age & gender
                                                </Trans>
                                            </dt>
                                            <dd>
                                                { new Date().getFullYear() - user.static.year } <Trans>years old</Trans> • { t(user.static.gender).toUpperCase() }
                                            </dd>
                                            <dt>
                                                <Trans>
                                                    Relation to BIL
                                                </Trans>
                                            </dt>
                                            <dd>
                                                { t(user.relation.type).toUpperCase() }
                                            </dd>
                                        </dl>
                                    </div>

                                    <hr className="uk-margin-remove"/>

                                    <div className="uk-padding-small">
                                        <h5 className="uk-h5 uk-margin-remove">
                                             <Trans>
                                                 Contacts
                                             </Trans>
                                        </h5>
                                        { user.contacts ? user.contacts.map(contact => (
                                            <div style={{ padding: '8px 0px' }}>
                                                { getIcon(contact.type) }
                                                <span style={{ margin: '0px 16px', verticalAlign: 'middle' }}>
                                                    { contact.data }
                                                </span>
                                            </div>
                                        )) : null }
                                    </div>

                                    <hr className="uk-margin-remove"/>

                                    <div className="uk-padding-small user-interests">
                                        <h5 className="uk-h5 uk-margin-remove uk-margin-small-bottom">
                                            <Trans>
                                                Offers
                                            </Trans>
                                        </h5>
                                        { user.interests.offers.map(offer => (
                                            <a onClick={() => this.changeTag(offer)} className="uk-link-heading">
                                                { tags.find(tag => tag.id===offer) ? tags.find(tag => tag.id===offer).value[i18n.language] : null }
                                            </a>
                                        ))}
                                    </div>

                                    <hr className="uk-margin-remove"/>

                                    <div className="uk-padding-small user-interests">
                                        <h5 className="uk-h5 uk-margin-remove uk-margin-small-bottom">
                                            <Trans>
                                                Needs
                                            </Trans>
                                        </h5>
                                        { user.interests.needs.map(need => (
                                            <a onClick={() => this.changeTag(need)} className="uk-link-heading">
                                                { tags.find(tag => tag.id===need) ? tags.find(tag => tag.id===need).value[i18n.language] : null }
                                            </a>
                                        ))}
                                    </div>

                                    <hr className="uk-margin-remove"/>

                                    <div className="uk-padding-small">
                                        <h5 className="uk-h5 uk-margin-remove">
                                            <Trans>
                                                Work experience
                                            </Trans>
                                        </h5>
                                        <Timeline className="uk-margin-small-top">
                                            { user.work ? user.work.map(experience => (
                                                <Timeline.Item color={experience.end ? "gray" : "green"}>
                                                    <small className="uk-text-small">
                                                        { moment(experience.start.seconds ? experience.start.seconds*1000 : experience.start).format("LL") } - { experience.end ? moment(experience.end.seconds ? experience.end.seconds*1000 : experience.end).format("LL") : "Present" }
                                                    </small>
                                                    <h5 className="uk-margin-remove">
                                                        { experience.company }
                                                    </h5>
                                                    <p className="uk-margin-remove">
                                                        { experience.position }
                                                    </p>
                                                </Timeline.Item>
                                            )) : null }
                                        </Timeline>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={24} md={16}>
                                <div>
                                    <div className="uk-padding-small posts-border uk-background-default" style={{ minHeight: "calc(100vh)"}}>
                                        { currentUser&&currentUser.uid===user.id ? (
                                            <Row>
                                                <Col flex={"auto"}>
                                                    <div className={"uk-text-center"}>
                                                        <Button onClick={() => this.changeView("posts")} type={currentView==="posts" ? "primary" : "default"}>
                                                            <Trans>
                                                                Posts
                                                            </Trans>
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={"uk-text-center"}>
                                                        <Button onClick={() => this.changeView("orders")} type={currentView==="orders" ? "primary" : "default"}>
                                                            <Trans>
                                                                Orders
                                                            </Trans>
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={"uk-text-center"}>
                                                        <Button onClick={() => this.changeView("saved")} type={currentView==="saved" ? "primary" : "default"}>
                                                            <Trans>
                                                                Saved
                                                            </Trans>
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col span={6}>
                                                    <div className={"uk-text-center"}>
                                                        <Button onClick={() => this.changeView("account")} type={currentView==="account" ? "primary" : "default"}>
                                                            <Trans>
                                                                Account
                                                            </Trans>
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        ) : null }


                                        { view() }


                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
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