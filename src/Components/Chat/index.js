import React from "react";
import {Trans} from "react-i18next";
import Firebase from "../../config/fbConfig";
import {
    createMessage,
    deleteMessage,
    getChats,
    getMessages,
    getUser,
    searchPeople, setSeen,
    updateMessage
} from "../../functions/chat";
import {
    Col,
    Comment,
    Row,
    Typography,
    Avatar,
    Input,
    List,
    Button,
    Dropdown,
    Menu,
    message,
    Skeleton,
    Popconfirm, Drawer, Popover, Badge
} from "antd";
import "./index.css"
import moment from "moment";
import {handleFiles} from "../Helper/Handler";
import UIkit from "uikit";
import { LoadingOutlined } from "@ant-design/icons";
import {a, NavLink} from "react-router-dom";
import {chatTime, getQuery, loadingView} from "../../functions/helper";
import vars from "../../config/vars.json";
const { Search } = Input;
const { SubMenu } = Menu;

class Index extends React.Component {

    state = {
        searchText: null,
        chats: [],
        loading: true,
        allLoaded: false,
        users: [],
        currentUser: this.props.firebase.auth().currentUser,
        messages: [],
        id: getQuery(this.props).id,
        urls: [],
        files: [],
        body: "",
        messageLoading: false,
        allMessageLoaded: false,
        searching: false,
        userLoading: getQuery(this.props).id ? true : false,
        user: null,
        messageId: null,
        uploading: false,
        zoomed: false,
        currentQuery: null,
        currentChat: null,
        drawer: false
    }


    componentDidMount() {
        this.getChats(null);
        if(getQuery(this.props).id){
            this.changeChat(getQuery(this.props).id, null);
        }
    }

    changeSearchText = e => {
        this.setState({
            searchText: e.target.value
        })
    }


    deselectChat = () => {
        const { currentUser, chats, currentQuery } = this.state;
        if(currentQuery !== null){
            currentQuery();
        }
        this.setState({
            id: null,
            user: null,
            body: null,
            messages: [],
            urls: [],
            files: [],
            currentQuery: null,
            currentChat: null,
            drawer: false
        })
    }

    changeChat = (id = null, user = null) => {
        const { currentUser, chats, currentQuery } = this.state;
        if(currentQuery !== null){
            currentQuery();
        }
        const member = user ? user : (chats.find(chat => chat.id===id) ? chats.find(chat => chat.id===id).member : null);
        const currentChat = chats.find(chat => chat.id===id);
        const newId = id ? id : (user.id>currentUser.uid ? `${currentUser.uid}${user.id}` : `${user.id}${currentUser.uid}`)
        const ref = Firebase.firestore().collection("chats").doc(newId).collection("messages").orderBy("createdAt", "desc").limit(20);
        const currentRef = ref.onSnapshot(snapshot => {
            let tempMessages = this.state.messages;
            snapshot.forEach((doc, i) => {
                const index = tempMessages.findIndex(mes => mes.id===doc.id);
                if(index > -1){
                    tempMessages[index] = {
                        id: doc.id,
                        ...doc.data()
                    };
                } else {
                    tempMessages.push({
                        id: doc.id,
                        ...doc.data()
                    });
                }
            });
            this.setState({
                messageLoading: false,
                messages: tempMessages.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds),
                allMessageLoaded: snapshot.docs.length < 20
            }, () => {
                this.setSeen(this.state.id);
            });
        });
        this.setState({
            id: newId,
            body: null,
            messages: [],
            urls: [],
            files: [],
            user: member,
            currentQuery: currentRef,
            currentChat: currentChat,
            drawer: true
        }, () => {
            if(!member){
                this.getUserInfo(id);
            }
        })
    }

    loadMoreMessages = () => {
        const { messages } = this.state;
        this.getMessages(messages[messages.length-1].createdAt);
    }


    setSeen = (id) => {
        const { chats, currentUser } = this.state;
        setSeen(id).then(() => {
            const index = chats.findIndex(chat => chat.id===id);
            chats[index].messages[currentUser.uid] = 0
            this.setState({
                chats: chats
            });
        }).catch(err => {
            console.log(err);
        })
    }

    getMessages = (startAfter) => {
        this.setState({
            messageLoading: true
        });
        getMessages(this.state.id, startAfter).then(messages => {
            this.setState({
                messageLoading: false,
                messages: [...this.state.messages, ...messages],
                allMessageLoaded: messages.length < 20
            }, () => {
                this.setSeen(this.state.id);
            });
        }).catch(err => {
            this.setState({
                messageLoading: false
            });
            console.log(err);
            message.error(err.message);
        })
    }

    onChange = (e) => {
        this.setState({
            body: e.target.value
        })
    }

    searchUsers = value => {
        if(value && value.length > 0) {
            this.setState({
                loading: true,
                searching: true
            })
            searchPeople(value).then(users => {
                this.setState({
                    loading: false,
                    users: users,
                    allLoaded: users.length < 20
                })
            }).catch(err => {
                this.setState({
                    loading: false
                })
                message.error(err.message);
            })
        } else {
            this.setState({
                searching: false,
                allLoaded: false,
                chats: [],
                loading: true
            }, () => {
                this.getChats(null);
            })
        }
    }

    getUserInfo = (id) => {
        const { currentUser, chats } = this.state;
        const uid = id.replace(currentUser.uid, "");
        getUser(uid).then(user => {
            const index = chats.findIndex(chat => chat.id===id);
            chats[index].member = user;
            this.setState({
                chats: chats,
                userLoading: false,
                user: user
            });
        }).catch(err => {
            message.error(err.message);
        })
    }

    addImages = (e) => {
        const files = e.target.files;
        handleFiles(files, [], 0, 4, (urls) => {
            this.setState({
                urls: [...this.state.urls, ...urls].slice(0, 4),
                files: [...this.state.files, ...files].slice(0, 4)
            });
        });
    }

    removeFile = (index) => {
        const { updatingMessage } = this.state;
        const { currentChat } = this.props;

        if(updatingMessage){
            // deleteImage(currentChat.id, updatingMessage.id, index, updatingMessage.urls, (status, message) => {
            //     this.showNotification(status, message);
            // });
        } else {
            let files = this.state.files;
            let urls = this.state.urls;
            urls.splice(index, 1);
            files.splice(index, 1)
            this.setState({
                files: files,
                urls: urls
            })
        }
    }

    getChats = (startAfter) => {
        const ref = Firebase.firestore().collection("chats").orderBy("updatedAt", "desc").where("members", "array-contains",  this.state.currentUser.uid);
        ref.onSnapshot(snapshot => {
            let tempMessages = this.state.chats;
            snapshot.forEach((doc, i) => {
                const index = tempMessages.findIndex(mes => mes.id===doc.id);
                if(index > -1){
                    tempMessages[index] = {
                        id: doc.id,
                        member: tempMessages[index].member,
                        ...doc.data(),
                    };
                } else {
                    this.getUserInfo(doc.id);
                    tempMessages.push({
                        id: doc.id,
                        ...doc.data()
                    });
                }
            });
            this.setState({
                loading: false,
                chats: tempMessages.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds),
                allLoaded: snapshot.docs.length < 20
            });
        });
    }

    submitMessage = () => {
        let { messageId, id, body, currentUser, files, messages } = this.state;
        this.setState({
            uploading: true
        });
        if(messageId && body){
            updateMessage(id, messageId, {
                body: body,
                updatedAt: new Date()
            }).then((res) => {
                const index = messages.findIndex(mes => mes.id===messageId);
                messages[index].body = body;
                messages[index].updatedAt = new Date();
                this.setState({
                    uploading: false,
                    messages: messages,
                    body: null,
                    messageId: null,
                    files: [],
                    urls: []
                });
            }).catch(err => {
                this.setState({
                    uploading: false
                });
                message.error(err.message);
            })
        } else if(body || files.length > 0) {
            const newMessage = {
                body: body,
                urls: [],
                seen: false,
                author: currentUser.uid,
                createdAt: new Date(),
                updatedAt: null
            };
            createMessage(id, newMessage, files).then((res) => {
                newMessage.urls = res.urls;
                newMessage.id = res.id;
                const index = messages.findIndex(mes => mes.id===res.id);
                if(index < 0) {
                    messages = [newMessage, ...messages];
                }
                this.setState({
                    uploading: false,
                    messages: messages,
                    body: null,
                    messageId: null,
                    files: [],
                    urls: []
                });
            }).catch(err => {
                this.setState({
                    uploading: false
                });
                message.error(err.message);
            })
        } else {
            this.setState({
                uploading: false
            });
        }
    }

    updateMessage = (message) => {
        this.setState({
            body: message.body,
            messageId: message.id
        })
    }

    cancelUpdate = () => {
        this.setState({
            body: null,
            messageId: null
        })
    }

    deleteMessage = (message) => {
        const { id, messages } = this.state;
        deleteMessage(id, message.id).then(() => {
            const index = messages.findIndex(mes => mes.id===message.id);
            messages.splice(index, 1);
            this.setState({
                messages: messages
            });
        }).catch(err => {
            message.error(err.message);
        })
    }

    render() {
        const { drawer, chats, messages, body, urls, searching, users, loading, user, messageLoading, allMessageLoaded, id, userLoading, searchText, uploading, currentUser, messageId, currentChat } = this.state;
        const { i18n, t } = this.props;

        const usersView = () => users.map(user => (
            <div>
                <div onClick={() => this.changeChat(null, user)} style={{ padding: "8px 16px", cursor: "pointer" }}>
                    <Avatar src={user.info.avatar} />
                    <a  className="uk-h5 uk-link-heading" style={{ margin: '0 16px', verticalAlign: 'middle' }}>
                        {user.info.name}
                    </a>
                </div>
                <hr className="uk-margin-remove"/>
            </div>
        ));

        const chatsView = () => chats.filter(chat => chat.member).map(chat => (
            <div>
                <div onClick={() => this.changeChat(chat.id, chat.member)} style={{ padding: "8px 16px", cursor: "pointer" }} className="uk-flex uk-flex-middle">
                    <div>
                        <Avatar src={chat.member.info.avatar} />
                    </div>

                    <div style={{ margin: '0 16px', verticalAlign: 'middle' }}>
                        <a className="uk-h5 uk-link-heading">
                            { chat.member.info.name }
                        </a>

                        <p className="uk-text-small uk-margin-remove">
                            { chat.messages&&chat.messages[currentUser.uid]>0 ?
                                `${chat.messages ? chat.messages[currentUser.uid] : 0 } ${t("unread messages")}` : t("You're all caught up")
                            } • { chatTime(chat.updatedAt)}
                        </p>
                    </div>
                </div>
                <hr className="uk-margin-remove"/>
            </div>
        ));


        const messagesView = (
            <div>
                <div id={"chat-messages"} style={{ height: "calc(100vh - 216px)", width: "100%"}} className=" uk-panel uk-panel-scrollable uk-padding-small uk-padding-remove-vertical">
                    { messageLoading ? loadingView :
                        <div>
                            { messages.map(message => (
                                <div>
                                    <Comment
                                        actions={ message.author!==currentUser.uid ? [] : [
                                            <a className="uk-padding-small uk-padding-remove-left uk-padding-remove-vertical uk-text-warning" onClick={ () => this.updateMessage(message) }>
                                                Edit
                                            </a>,
                                            <a className="uk-padding-small uk-padding-remove-left uk-padding-remove-vertical">
                                                <Popconfirm
                                                    title={"Are you sure delete the message?"}
                                                    onConfirm={() => this.deleteMessage(message)}
                                                    okText={"Delete"}
                                                    cancelText={"Dismiss"}
                                                >
                                                    <a className="uk-text-danger">
                                                        <Trans>
                                                            Delete
                                                        </Trans>
                                                    </a>
                                                </Popconfirm>
                                            </a>
                                        ]}
                                        author={
                                            <a className={message.author===currentUser.uid ? null : "auth-color"}>
                                                { message.author===currentUser.uid ?
                                                    `${currentUser.displayName}`
                                                    : (userLoading || !user.info ? <Skeleton avatar paragraph={{ rows: 1 }} /> : user.info.name)}
                                            </a>
                                        }
                                        datetime={
                                            <a>
                                                { message.updatedAt ? `${t("Updated at")} ${chatTime(message.updatedAt)}` : chatTime(message.createdAt) } { message.author!==currentUser.uid ? null : (user&&currentChat&&currentChat.messages&&messages.filter(mes => mes.author===currentUser.uid).indexOf(message)>=currentChat.messages[user.id] ? "read" : "unread") }
                                            </a>
                                        }
                                        avatar={
                                            <Avatar
                                                src={ message.author===currentUser.uid ? currentUser.photoURL : (userLoading || !user.info ? null : user.info.avatar) }
                                                alt="Han Solo"
                                            />
                                        }
                                        content={
                                            <div>
                                                <div>
                                                    <Row gutter={[4, 4]}>
                                                        {message.urls.map(url => (
                                                            <Col sm={12} md={6}>
                                                                <div>
                                                                    <img className="uk-width-1-1 uk-height-max-medium" src={url.url} onClick={() =>
                                                                        UIkit.lightboxPanel({
                                                                            items : message.urls.map(image => {
                                                                                return {
                                                                                    source: image.url,
                                                                                    type: "image",
                                                                                    caption: image.name
                                                                                }
                                                                            }),
                                                                            index: message.urls.indexOf(url)
                                                                        }).show()} />
                                                                </div>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                                { message.body }
                                            </div>
                                        } />
                                </div>
                            ))}
                        </div>
                    }
                </div>

                <div className="uk-position-bottom">
                    <div className="uk-background-muted">
                        { urls.length>0 ?
                            <div className="uk-flex uk-flex-middle uk-padding-small">
                                <div className="uk-grid-small" uk-grid={"true"}>
                                    { urls.map(url => (
                                        <div className="uk-inline uk-width-1-4 uk-border-rounded">
                                            <img className="uk-width-1-1 uk-margin-auto-vertical uk-height-max-medium uk-border-rounded" src={url} />
                                            <div className="uk-position-top-right uk-overlay uk-background-muted uk-border-rounded" style={{ padding: "4px 8px"}}>
                                                <a className="uk-text-danger fas fa-times" onClick={() => this.removeFile(urls.indexOf(url))}   />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            : null }

                        <div className="chat-textarea">
                            <div gutter={3} className="uk-flex uk-flex-middle">

                                { messageId ?
                                    <button className="auth-clip-button uk-text-secondary" type="button" onClick={this.cancelUpdate}>
                                        <Trans>
                                            Cancel
                                        </Trans>
                                    </button>
                                    :
                                    <div uk-form-custom="true">
                                        <input multiple={true} onChange={this.addImages} type="file"  />
                                        <button className="auth-clip-button" type="button" tabIndex="-1">
                                            <div className={urls.length>0 ? "uk-text-warning" : "uk-text-secondary"}>
                                                { urls.length>0 ? t("Change") : t("Choose")}
                                            </div>
                                        </button>
                                    </div>
                                }


                                <Input.TextArea
                                    value={body}
                                    onChange={this.onChange}
                                    className="uk-border-rounded uk-margin-small-right uk-margin-small-left"
                                    placeholder={t("Type a message")}
                                />

                                <a onClick={this.submitMessage} className="auth-send-button">
                                    { uploading ?
                                        <div>
                                            <Trans>
                                                Uploading
                                            </Trans>
                                        </div> :
                                        <div>
                                            <Trans>
                                                Send
                                            </Trans>
                                        </div>
                                    }
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );


        return (
            <div>
                <div className={window.innerWidth < 768 ? "" : "uk-container"}>
                    <div className="uk-background-default uk-box-shadow-small">
                        <Row gutter={4}>
                            <Col md={8} sm={24} className={window.innerWidth < 768&&drawer ? "uk-hidden" : ""}>
                                <div uk-overflow-auto="true" style={{ height: "calc(100vh  - 88px)" }} className={"uk-padding-small uk-padding-remove-vertical"}>
                                    <div>
                                        <div>
                                            <Row gutter={2}>
                                                <Col span={4}>
                                                    <div>
                                                        <Popover placement="bottomRight" content={(
                                                            <div className="uk-width-medium">
                                                                <Menu className={"menu"} mode="vertical">
                                                                    <SubMenu title={
                                                                        <div>
                                                                            <Trans>
                                                                                About Us
                                                                            </Trans>
                                                                        </div>
                                                                    }
                                                                    >
                                                                        <Menu.Item>
                                                                            <NavLink to="/story">
                                                                                <Trans>
                                                                                    Story
                                                                                </Trans>
                                                                            </NavLink>
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            <NavLink to="/policy">
                                                                                <Trans>
                                                                                    Terms and Conditions
                                                                                </Trans>
                                                                            </NavLink>
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            <NavLink to="/team">
                                                                                <Trans>
                                                                                    Team
                                                                                </Trans>
                                                                            </NavLink>
                                                                        </Menu.Item>
                                                                    </SubMenu>
                                                                    <Menu.Item key="posts">
                                                                        <NavLink to="/posts">
                                                                            <Trans>
                                                                                Posts
                                                                            </Trans>
                                                                        </NavLink>
                                                                    </Menu.Item>
                                                                    <Menu.Item key="news">
                                                                        <NavLink to="/news">
                                                                            <Trans>
                                                                                News
                                                                            </Trans>
                                                                        </NavLink>
                                                                    </Menu.Item>
                                                                    <Menu.Item key="events">
                                                                        <NavLink to="/events">
                                                                            <Trans>
                                                                                Events
                                                                            </Trans>
                                                                        </NavLink>
                                                                    </Menu.Item>
                                                                    <Menu.Item key="projects">
                                                                        <NavLink to="/projects">
                                                                            <Trans>
                                                                                Projects
                                                                            </Trans>
                                                                        </NavLink>
                                                                    </Menu.Item>
                                                                    <Menu.Item key="items">
                                                                        <NavLink to="/items">
                                                                            <Trans>
                                                                                Merch
                                                                            </Trans>
                                                                        </NavLink>
                                                                    </Menu.Item>
                                                                </Menu>
                                                            </div>
                                                        )}>
                                                            <a className={"uk-text-bold"} style={{ lineHeight: "56px" }}>
                                                                <i className={"far fa-bars"}/>
                                                            </a>
                                                        </Popover>
                                                    </div>
                                                </Col>
                                                <Col span={16}>
                                                    <div className={"uk-text-center"}>
                                                        <NavLink to="/">
                                                            <img src={require("../Layout/logo.png")} style={{ height: "56px" }} />
                                                        </NavLink>
                                                    </div>
                                                </Col>
                                                <Col span={4}>
                                                    <div style={{ height: "56px" }} className={"uk-text-right"}>
                                                        <Popover placement="bottomLeft" content={(
                                                            <div className="uk-width-medium">
                                                                <Menu className={"menu"} mode="vertical">
                                                                    <Menu.Item>
                                                                        <NavLink to={"/users/"+currentUser.uid}>
                                                                            <Trans>
                                                                                Profile
                                                                            </Trans>
                                                                        </NavLink>
                                                                    </Menu.Item>
                                                                    { currentUser.emailVerified ? null : (
                                                                        <Menu.Item>
                                                                            <a href={"/mail.google.com"} className="head-example">
                                                                                <Trans>
                                                                                    Confirm mail
                                                                                </Trans>
                                                                            </a>
                                                                        </Menu.Item>
                                                                    )}
                                                                    { currentUser.uid===vars.admin ? (
                                                                        <Menu.Item>
                                                                            <NavLink to={"/admin"} className="head-example">
                                                                                <Trans>
                                                                                    Admin page
                                                                                </Trans>
                                                                            </NavLink>
                                                                        </Menu.Item>
                                                                    ) : null }
                                                                    <Menu.Item>
                                                                        <Badge count={user ? user.messages : 0}>
                                                                            <NavLink to={"/chats"} className="head-example">
                                                                                <Trans>
                                                                                    Messages
                                                                                </Trans>
                                                                            </NavLink>
                                                                        </Badge>
                                                                    </Menu.Item>
                                                                    <Menu.Item onClick={this.signOut} className="uk-text-bold uk-text-danger">
                                                                        <Trans>
                                                                            Log out
                                                                        </Trans>
                                                                    </Menu.Item>
                                                                </Menu>
                                                            </div>
                                                        )}>
                                                            <a style={{lineHeight: "56px"}}>
                                                                <img src={currentUser.photoURL} className="uk-border-circle" style={{ height: "44px", width: "44px" }}/>
                                                            </a>
                                                        </Popover>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className="uk-padding-small uk-padding-remove-horizontal uk-background-default">
                                            <Search
                                                value={searchText}
                                                onChange={this.changeSearchText}
                                                placeholder={t("Search users")}
                                                onSearch={this.searchUsers}
                                            />
                                        </div>
                                    </div>
                                    <div className="chats">
                                        { loading ? loadingView : ( searching ? usersView() : chatsView() ) }
                                    </div>
                                </div>
                            </Col>

                            <Col md={16} sm={24} className={window.innerWidth < 768&&!drawer ? "uk-hidden" : ""}>
                                <div className="chat-messages">
                                    <div style={{ height: "calc(100vh - 88px)", width: "100%"}}>
                                        { id ?
                                            <div>
                                                <div className="chat-navigation">
                                                    <div>
                                                        { userLoading || !user || !user.info ?
                                                            <Skeleton avatar paragraph={{ rows: 1 }} />
                                                            :
                                                            <div>
                                                                <Row>
                                                                    <Col span={22}>
                                                                        <div>
                                                                            <Avatar size="large" src={user.info.avatar} />
                                                                            <a className="uk-h4 uk-link-heading" style={{ margin: "0 16px", verticalAlign: "middle" }}>
                                                                                {user.info.name}
                                                                            </a>
                                                                        </div>
                                                                    </Col>
                                                                    <Col span={2}>
                                                                        <div onClick={this.deselectChat} className={"main-color"}>
                                                                            <a className={"uk-h4 uk-link-heading"} style={{ margin: "0 16px", verticalAlign: "middle" }}>
                                                                                <i uk-icon={"close"} />
                                                                            </a>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                { messagesView }
                                            </div> :
                                            <img className="uk-height-1-1" src="https://images.pexels.com/photos/4097160/pexels-photo-4097160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
                                        }
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


export default Index;