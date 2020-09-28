import React from "react";
import {Button, Col, Form, Input, message, Row, Typography, List, Avatar} from 'antd';
import {getAdmin, updateAdmin} from "../../functions/admin";
import {Trans} from "react-i18next";

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};


class Team extends React.Component {

    state = {
        team: [],
        image: null,
        loading: false
    };


    componentDidMount() {
        getAdmin().then(data => {
            this.setState({
                team: data.team&&data.team.members ? data.team.members : [],
            })
        })
    }


    onImageSelect = (e) => {
        this.setState({
            image: e.target.value
        });
    }

    addMember = (values) => {
        const { team } = this.state;
        team.push(values);

        updateAdmin("team", {
            members: team
        }).then(() => {
            this.setState({
                team: team,
                image: null
            })
        }).catch((err) => {
            message.error(err.message);
        });
    }



    render() {
        const { i18n } = this.props;
        const { team, image } = this.state;



        return (
            <div className="uk-padding">

                <div>
                    <Typography.Title level={4} className="section-header uk-text-bold">
                        <Trans>
                            Team
                        </Trans>
                    </Typography.Title>
                </div>

                <div>
                    <List
                        itemLayout="horizontal"
                        dataSource={team}
                        renderItem={member => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={member.image} />}
                                    title={<a>{member.name[i18n.language]}</a>}
                                    description={`${ member.role[i18n.language] } • ${ member.year }`}
                                />
                            </List.Item>
                        )}
                    />
                    <div className="uk-border-rounded uk-box-shadow-small uk-padding-small">
                        <Row gutter={[8, 8]}>
                            <Col sm={24} md={6}>
                                <div>
                                    <img className="uk-height-small uk-width-small uk-border-rounded" src={image} />
                                </div>
                            </Col>
                            <Col sm={24} md={18}>
                                <div>
                                    <Form {...layout} onFinish={this.addMember} className={"uk-width-1-1"}>
                                        <Row gutter={[8, 8]} className={"uk-width-1-1"}>
                                            <Col span={8}>
                                                <div>
                                                    <Form.Item rules={[{
                                                        required: true
                                                    }]} name={["name", "kz"]} className="uk-width-1-1">
                                                        <Input placeholder="Аты жөні" />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div>
                                                    <Form.Item rules={[{
                                                        required: true
                                                    }]} name={["name", "en"]} className="uk-width-1-1">
                                                        <Input placeholder="Full name" />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div>
                                                    <Form.Item rules={[{
                                                        required: true
                                                    }]} name={["name", "ru"]} className="uk-width-1-1">
                                                        <Input placeholder="ФИО" />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div>
                                                    <Form.Item rules={[{
                                                        required: true
                                                    }]} name={["role", "kz"]} className="uk-width-1-1">
                                                        <Input placeholder="Рөлі" />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div>
                                                    <Form.Item rules={[{
                                                        required: true
                                                    }]} name={["role", "en"]} className="uk-width-1-1">
                                                        <Input placeholder="Role" />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div>
                                                    <Form.Item rules={[{
                                                        required: true
                                                    }]} name={["role", "ru"]} className="uk-width-1-1">
                                                        <Input placeholder="Роль" />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div>
                                                    <Form.Item
                                                        name="year"
                                                        rules={[{
                                                            required: true
                                                        }]}
                                                        className="uk-width-1-1"
                                                    >
                                                        <Input type="number" min="1993" max={`${new Date().getFullYear()}`} placeholder={"Grad year"} />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div>
                                                    <Form.Item
                                                        className="uk-width-1-1"
                                                        name="image"
                                                    >
                                                        <Input onChange={this.onImageSelect} placeholder="Image url" />
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={24}>
                                                <div>
                                                    <Form.Item>
                                                        <Button type="primary" htmlType="submit">
                                                            <Trans>
                                                                Add member
                                                            </Trans>
                                                        </Button>
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

            </div>
        );
    }
}


export default Team;
