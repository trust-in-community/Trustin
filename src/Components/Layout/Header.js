import React from "react";
import {Badge, Popover, Avatar, Dropdown, Menu, Button, Input, Form, Row, Drawer, message, Col} from 'antd';
import "./layout.css"
import { withTranslation, Trans } from 'react-i18next'
import {connect} from "react-redux";
import moment from "moment";
import { NavLink } from "react-router-dom";
import locales from "../../config/locale-kz";
import {getUser} from "../../functions/chat";
import {
    handleResetPassword,
    handleResetPasswordCode, handleVerifyEmail,
    sendPasswordResetEmail,
    signIn,
    signOut
} from "../../functions/user";
import vars from "../../config/vars.json";
const { SubMenu } = Menu;


class Header extends React.Component {


    state = {
        loading: false,
        login_drawer: false,
        reset_drawer: false,
        forgot_drawer: false,
        user: null,
        code: null
    };

    onShow = (type) => {
        const types = [{
            "login_drawer": false,
            "forgot_drawer": false,
            "reset_drawer": false
        }];
        types[`${type}_drawer`] = true
        this.setState(types);
    }

    onClose = (type) => {
        this.setState({
            [`${type}_drawer`]: false
        })
    }


    login = (values) => {
        const t = this.props.t;
        this.setState({
            loading: true
        });

        signIn(values).then(() => {
            this.setState({
                loading: false,
                login_drawer: false
            }, () => {
                message.success(t("Successfully signed in"))
            });
        }).catch(err => {
            this.setState({
                loading: false,
            }, () => {
                message.error(err.message);
            });
        })
    }

    sendMail = (values) => {
        const t = this.props.t;
        this.setState({
            loading: true
        });
        sendPasswordResetEmail(values.email).then(() => {
            this.setState({
                loading: false,
                forgot_drawer: false
            }, () => {
                message.success(t("Please check your mail"))
            });
        }).catch(err => {
            this.setState({
                loading: false,
            }, () => {
                message.error(err.message);
            });
        })
    }

    resetPassword = (values) => {
        const t = this.props.t;
        this.setState({
            loading: true
        });
        handleResetPassword(this.state.code, values).then(() => {
            this.setState({
                loading: false,
                reset_drawer: false
            }, () => {
                message.success(t("Password changed successfully"));
            });
        }).catch(err => {
            this.setState({
                loading: false,
            }, () => {
                message.error(err.message);
            });
        })
    }

    signOut = () => {
        this.setState({
            loading: true
        });
        signOut().then(() => {
            this.setState({
                loading: false
            }, () => {
                message.success(this.props.t("We will miss you"));
            });
        }).catch(err => {
            this.setState({
                loading: false,
            }, () => {
                message.error(err.message);
            });
        })
    }



    componentDidMount() {
        const { i18n, t } = this.props;
        moment.locale(i18n.language, locales[i18n.language]);
        const { auth } = this.props;
        const { reset_drawer, code } = this.state;
        const queries = window.location.search.substr(1, window.location.search.length).split("&");
        if(queries[0] === "mode=resetPassword" && !auth.uid && !reset_drawer) {
            this.setState({
                code: queries[1].substr(8, queries[1].length)
            }, () => {
                handleResetPasswordCode(code).then(email => {
                    this.setState({
                        reset_drawer: true,
                        email: email
                    });
                }).catch(err => {
                    message.error(err.message);
                })
            });
        } else if (queries[0] === "mode=verifyEmail" && auth.emailVerified === false) {
            handleVerifyEmail(queries[1].substr(8, queries[1].length)).then(() => {
                message.success(t("Email successfully verified"));
            }).catch(err => {
                message.error(err.message);
            })
        }

        if(auth&&auth.uid){
            getUser(auth.uid).then(user => {
                this.setState({
                    user: user
                })
            })
        }

    }


    changeLanguage = (lang) => {
        const { i18n } = this.props;
        moment.locale("lang", locales[lang]);
        i18n.changeLanguage(lang)
    }


    render() {
        const { t, auth, i18n, currentView } = this.props;
        const { loading, login_drawer, forgot_drawer, user, reset_drawer } = this.state;
        const views = {
            "/": "root",
            "/story": "story",
            "/terms": "story",
            "/team": "team",
            "/news/new": "news",
            "/news": "news",
            "/news/:id": "news",

            "/events/new": "events",
            "/events": "events",
            "/events/:id": "events",

            "/projects/new": "events",
            "/projects": "events",
            "/projects/:id": "events",

            "/posts/new": "posts",
            "/posts": "posts",

            "/items/new": "items",
            "/items": "items",

            "/chats": "chats",

            "/users/:id": "profile",

            "/signup": "signup",

            "/admin": "profile",
        };
        const layout = {
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
        };

        return (
            <div>
                <div style={{ backgroundColor: "#001529"}}>
                    <div className="uk-container top-navbar">
                        <Row gutter={2}>
                            <Col span={8}>
                                <div style={{ height: "46px"}}>
                                    <Dropdown  style={{ height: "46px"}} overlay={(
                                        <Menu  mode="horizontal" theme="dark">
                                            <Menu.Item className={i18n.language == "kz" ? "white-color" : null } onClick={() => this.changeLanguage("kz")}>
                                                Қазақша
                                            </Menu.Item>
                                            <Menu.Item className={i18n.language == "en" ? "white-color" : null } onClick={() => this.changeLanguage("en")}>
                                                English
                                            </Menu.Item>
                                            <Menu.Item className={i18n.language == "ru" ? "white-color" : null } onClick={() => this.changeLanguage("ru")}>
                                                Руский
                                            </Menu.Item>
                                        </Menu>
                                    )}>
                                        <div style={{ height: "46px", lineHeight: "46px" }} className="ant-dropdown-link white-color" onClick={e => e.preventDefault()}>
                                            <img className="uk-margin-small-right" src={require("../Media/" + i18n.language + ".png")} />
                                            <Trans>
                                                Language
                                            </Trans>
                                        </div>
                                    </Dropdown>
                                </div>
                            </Col>
                            <Col span={16}>
                                <div className={"uk-text-right uk-float-right"}>
                                    <Menu  mode="horizontal" theme="dark">
                                        <Menu.Item>
                                            <a href={"https://chat.whatsapp.com/6wk2uZKJMxKGZ4sAPgB0Jn"}>
                                                <i className="fab fa-whatsapp"  />
                                            </a>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <a href={"https://www.instagram.com/trustin.kz/"}>
                                                <i className="fab fa-instagram"  />
                                            </a>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <a href={`mailto:admin@trustin.kz`}>
                                                <i className="fas fa-envelope"  />
                                            </a>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <a href={`call:+77479141214`}>
                                                <i className="fas fa-phone" />
                                            </a>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <a href={"https://t.me/trustincom"}>
                                                <i className="fab fa-telegram" />
                                            </a>
                                        </Menu.Item>
                                    </Menu>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                { window.innerWidth < 768 ? (
                    <div className="uk-container">
                        <Row gutter={2}>
                            <Col span={4}>
                                <div>
                                    <Popover placement="bottomRight" content={(
                                        <div className="uk-width-medium">
                                            <Menu selectedKeys={[views[currentView]]} className={"menu"} mode="vertical">
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
                                        <img src={require("./logo.png")} style={{ height: "56px" }} />
                                    </NavLink>
                                </div>
                            </Col>
                            <Col span={4}>
                                <div style={{ height: "56px" }} className={"uk-text-right"}>
                                    { auth.uid ? (
                                        <Popover placement="bottomLeft" content={(
                                            <div className="uk-width-medium">
                                                <Menu className={"menu"} mode="vertical">
                                                    <Menu.Item>
                                                        <NavLink to={"/users/"+auth.uid}>
                                                            <Trans>
                                                                Profile
                                                            </Trans>
                                                        </NavLink>
                                                    </Menu.Item>
                                                    { auth.emailVerified ? null : (
                                                        <Menu.Item>
                                                            <a href={"/mail.google.com"} className="head-example">
                                                                <Trans>
                                                                    Confirm mail
                                                                </Trans>
                                                            </a>
                                                        </Menu.Item>
                                                    )}
                                                    { auth.uid===vars.admin ? (
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
                                                <img src={auth.photoURL} className="uk-border-circle" style={{ height: "44px", width: "44px" }}/>
                                            </a>
                                        </Popover>
                                    ) : (
                                        <Popover placement="bottomRight" content={(
                                            <div className="uk-width-medium">
                                                <Menu className={"menu"} mode="vertical">
                                                    <Menu.Item onClick={() => this.onShow("login")}>
                                                        <Trans>
                                                            Login
                                                        </Trans>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <NavLink to="/signup">
                                                            <Trans>
                                                                Sign Up
                                                            </Trans>
                                                        </NavLink>
                                                    </Menu.Item>
                                                    <Menu.Item onClick={() => this.onShow("forgot")}>
                                                        <Trans>
                                                            Forgot password
                                                        </Trans>
                                                    </Menu.Item>
                                                </Menu>
                                            </div>
                                        )}>
                                            <a className={"uk-text-bold"} style={{ lineHeight: "56px" }}>
                                                <Trans>
                                                    Login
                                                </Trans>
                                            </a>
                                        </Popover>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <div style={{ backgroundColor: "#fff"}}>
                        <div className="uk-container">
                            <Menu selectedKeys={[views[currentView]]} className={"menu"} mode="horizontal">
                                <Menu.Item key={"root"} className={"logo"}>
                                    <NavLink to="/">
                                        <img src={require("./logo.png")} style={{ height:"56px", width: "168px"}} />
                                    </NavLink>
                                </Menu.Item>
                                <SubMenu title={
                                    <a className="submenu-title-wrapper">
                                        <a className="head-example">
                                            <Trans>
                                                About Us
                                            </Trans>
                                        </a>
                                    </a>
                                }>
                                    <Menu.Item key={"story"}>
                                        <NavLink to="/story">
                                            <Trans>
                                                Story
                                            </Trans>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key={"terms"}>
                                        <NavLink to="/terms">
                                            <Trans>
                                                Terms
                                            </Trans>
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key={"team"}>
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
                                { auth.uid ?
                                    <SubMenu key={"profile"} title={
                                        <a className="submenu-title-wrapper">
                                            <a className="head-example">
                                                { auth.displayName }
                                            </a>
                                        </a>
                                    } className={"align-right uk-text-primary"}>
                                        <Menu.Item>
                                            <NavLink to={"/users/"+auth.uid}>
                                                <Trans>
                                                    Profile
                                                </Trans>
                                            </NavLink>
                                        </Menu.Item>
                                        { auth.emailVerified ? null : (
                                            <Menu.Item>
                                                <a href={"/mail.google.com"} className="head-example">
                                                    <Trans>
                                                        Confirm mail
                                                    </Trans>
                                                </a>
                                            </Menu.Item>
                                        )}
                                        { auth.uid===vars.admin ? (
                                            <Menu.Item>
                                                <NavLink to={"/admin"} className="head-example">
                                                    <Trans>
                                                        Admin page
                                                    </Trans>
                                                </NavLink>
                                            </Menu.Item>
                                        ) : null }
                                        <Menu.Item key={"chats"}>
                                            <NavLink to={"/chats"} className="head-example">
                                                <Trans>
                                                    Messages
                                                </Trans>
                                            </NavLink>
                                        </Menu.Item>
                                        <Menu.Item onClick={this.signOut} className="uk-text-bold uk-text-danger">
                                            <Trans>
                                                Log out
                                            </Trans>
                                        </Menu.Item>
                                    </SubMenu>
                                    :
                                    <SubMenu
                                        title={
                                            <span className="submenu-title-wrapper">
                                                <Trans>
                                                    Login
                                                </Trans>
                                            </span>
                                        }
                                        className={"align-right-large"}
                                    >
                                        <Menu.Item onClick={() => this.onShow("login")}>
                                            <Trans>
                                                Login
                                            </Trans>
                                        </Menu.Item>
                                        <Menu.Item key={"signup"}>
                                            <NavLink to="/signup">
                                                <Trans>
                                                    Sign Up
                                                </Trans>
                                            </NavLink>
                                        </Menu.Item>
                                        <Menu.Item onClick={() => this.onShow("forgot")}>
                                            <Trans>
                                                Forgot password
                                            </Trans>
                                        </Menu.Item>
                                    </SubMenu>
                                }
                            </Menu>
                        </div>
                    </div>
                )}
                <Drawer
                    title={t("Login")}
                    placement="right"
                    closable={true}
                    onClose={() => this.onClose("login")}
                    visible={login_drawer}
                    width={window.innerWidth > 768 ? 500 : "100%"}
                >
                    <div>
                        <div className={"uk-margin-top"}>
                            <img className="uk-width-1-1" src={require("./logo.png")} />
                        </div>
                        <div>
                            <Form
                                {...layout}
                                onFinish={this.login}
                            >
                                <Form.Item
                                    label={t("E-mail")}
                                    name="email"
                                    type="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input a valid email!")
                                        },
                                        {
                                            type: "email",
                                            message: t("Please input a valid email!")
                                        }
                                    ]}
                                >
                                    <Input prefix={
                                        <span className="fas fa-user" />
                                    } placeholder={t("E-mail")} />
                                </Form.Item>

                                <Form.Item
                                    label={t("Password")}
                                    name="password"
                                    rules={[{ required: true, message: t("Please input your password!") }]}
                                >
                                    <Input.Password prefix={
                                        <span className="fas fa-lock" />
                                    } placeholder={t("Password")} />
                                </Form.Item>

                                <div
                                    className="uk-text-right uk-margin-top"
                                >
                                    <a onClick={() => this.onShow("forgot")} className="login-form-forgot">
                                        <Trans>
                                            Reset password
                                        </Trans>
                                    </a>
                                </div>

                                <Form.Item className="uk-margin-top">
                                    <Button loading={loading} disabled={loading} size={"large"} htmlType={"submit"} type="primary" block>
                                        <Trans>
                                            Login
                                        </Trans>
                                    </Button>
                                </Form.Item>

                            </Form>
                        </div>
                    </div>
                </Drawer>

                <Drawer
                    title={t("Reset password")}
                    placement="right"
                    closable={true}
                    onClose={() => this.onClose("reset")}
                    visible={reset_drawer}
                    width={window.innerWidth > 768 ? 500 : "100%"}
                >
                    <div>
                        <div className={"uk-margin-top"}>
                            <img className="uk-width-1-1" src={require("./logo.png")} />
                        </div>
                        <div>
                            <Form
                                {...layout}
                                onFinish={this.login}
                            >
                                <Form.Item
                                    name="password"
                                    label={t("Password")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please enter safe password!"),
                                        },
                                        {
                                            pattern: new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"),
                                            message: t("Please enter safe password!"),
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder={t("Password")} prefix={
                                        <span className="fas fa-lock" />} />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    label={t("Confirm Password")}
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Required field"),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(t("The two passwords that you entered do not match!"));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder={t("Confirm Password")} prefix={
                                        <span className="fas fa-lock" />} />
                                </Form.Item>

                                <Form.Item className="uk-margin-top">
                                    <Button loading={loading} disabled={loading} size={"large"} htmlType={"submit"} type="primary" block>
                                        <Trans>
                                            Reset
                                        </Trans>
                                    </Button>
                                </Form.Item>

                            </Form>
                        </div>
                    </div>
                </Drawer>


                <Drawer
                    title={t("Forgot password")}
                    placement="right"
                    closable={true}
                    onClose={() => this.onClose("forgot")}
                    visible={forgot_drawer}
                    width={window.innerWidth > 768 ? 500 : "100%"}
                >
                    <div>
                        <div className={"uk-margin-top"}>
                            <img className="uk-width-1-1" src={require("./logo.png")} />
                        </div>
                        <div>
                            <Form
                                {...layout}
                                onFinish={this.sendMail}
                            >
                                <Form.Item
                                    label={t("E-mail")}
                                    name="email"
                                    type="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Please input a valid email!")
                                        },
                                        {
                                            type: "email",
                                            message: t("Please input a valid email!")
                                        }
                                    ]}
                                >
                                    <Input prefix={
                                        <span className="fas fa-user" />
                                    } placeholder={t("Email")} />
                                </Form.Item>

                                <Form.Item className="uk-margin-top">
                                    <Button loading={loading} disabled={loading} size={"large"} htmlType={"submit"} type="primary" block>
                                        <Trans>
                                            Send
                                        </Trans>
                                    </Button>
                                </Form.Item>

                            </Form>
                        </div>
                    </div>
                </Drawer>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {
    return {
        auth: state.firebase.auth,
        ...props
    }
}

export default connect(mapStateToProps)(withTranslation()(Header));
