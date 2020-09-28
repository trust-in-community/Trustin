import React from "react";
import { Typography, List, Menu, Row, Col, Input, Button, BackTop } from 'antd';
import "./layout.css"
import {
    MailTwoTone,
    MailOutlined,
    PhoneOutlined,
    FacebookOutlined,
    WhatsAppOutlined,
    Dropdown
} from '@ant-design/icons';
import {connect} from "react-redux";
import {withTranslation, Trans} from "react-i18next";
import {NavLink} from "react-router-dom";
const { SubMenu } = Menu;


class Footer extends React.Component {
    state = {
        current: 'mail',
    };



    render() {

        const { auth, t } = this.props;

        const about = [
            { name: t("Home"), link: "/"},
            { name: t("Story"), link: "/story"},
            { name: t("Terms"), link: "/terms"},
            { name: t("Team"), link: "/team"}
        ]

        const navigation = [
            { name: t("Posts"), link: "/posts"},
            { name: t("News"), link: "/news"},
            { name: t("Events"), link: "/events"},
            { name: t("Projects"), link: "/projects"},
            { name: t("Merch"), link: "/items"}
        ]

        const contacts = [
            { name: t("Instagram"), link: "https://t.me/trustincom"},
            { name: t("Telegram"), link: "https://t.me/trustincom"},
            { name: t("WhatsApp"), link: "https://chat.whatsapp.com/6wk2uZKJMxKGZ4sAPgB0Jn"},
            { name: t("Mail"), link: "mailto:admin@trustin.kz"},
            { name: t("Phone"), link: "call:+77479141214"}
        ]
        const style = {
            height: 36,
            lineHeight: '36px',
            borderRadius: 8,
            backgroundColor: '#144183',
            color: '#fff',
            textAlign: 'center',
            fontSize: 14,
        }

        console.log(this.props);

        if(window.location.pathname==="/users/"+auth.uid){
            return null;
        }

        return (
            <div>
                <BackTop>
                    <div style={style}>
                        <span className={"fas fa-chevron-up"} />
                    </div>
                </BackTop>

                <div className="uk-padding uk-background-muted">
                    <Row gutter={20} className="uk-container">
                        <Col sm={24} md={9}>
                            <img src={require("./logo.png")} className={"uk-width-1-1"} />
                            <p>
                                <Trans>
                                    Taraz KTL (now BIL) Alumni Association "Trust in Community" was opened on October 22, 2019 as a legal entity engaged in a special project. The main purpose of the association, initiated by sympathetic graduates, is to benefit society.
                                </Trans>
                            </p>
                        </Col>
                        <Col sm={24} md={5}>
                            <List
                                header={
                                    <div className="uk-text-uppercase uk-text-bolder">
                                        <Trans>
                                            About Us
                                        </Trans>
                                    </div>
                                }
                                dataSource={about}
                                renderItem={item => (
                                    <List.Item>
                                        <NavLink to={item.link}>
                                            {item.name}
                                        </NavLink>
                                    </List.Item>
                                )}
                            />
                        </Col>
                        <Col sm={24} md={5}>
                            <List
                                header={
                                    <div className="uk-text-uppercase uk-text-bolder">
                                        <Trans>
                                            Navigation
                                        </Trans>
                                    </div>
                                }
                                dataSource={navigation}
                                renderItem={item => (
                                    <List.Item>
                                        <NavLink to={item.link}>
                                            {item.name}
                                        </NavLink>
                                    </List.Item>
                                )}
                            />
                        </Col>
                        <Col sm={24} md={5}>
                            <List
                                header={
                                    <div className="uk-text-uppercase uk-text-bolder">
                                        <Trans>
                                            Contacts
                                        </Trans>
                                    </div>
                                }
                                dataSource={contacts}
                                renderItem={item => (
                                    <List.Item>
                                        <a href={item.link}>
                                            {item.name}
                                        </a>
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>
                </div>
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

export default connect(mapStateToProps)(withTranslation()(Footer));
