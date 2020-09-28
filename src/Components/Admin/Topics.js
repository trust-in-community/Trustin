import React from "react";
import {List, Drawer, Row, Col, Form, Input, Button, Select, Divider, Typography, message, Popconfirm} from 'antd';
import {createTag, createTopic, deleteTag, deleteTopic} from "../../functions/admin";
import { firestoreConnect } from "react-redux-firebase";
import {connect} from "react-redux";
import {compose} from "redux";
import {Trans, withTranslation} from "react-i18next";
import {getTags} from "../../functions/post";
import {getTopics} from "../../functions/news";

const { Option } = Select;
const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

class Topics extends React.Component {

    state = {
        visible: false,
        topics: [],
        editView: false
    };


    componentDidMount() {
        getTopics().then(topics => {
            this.setState({
                topics: topics
            });
        })
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onFinish = values => {
        const topics = this.state.topics;
        createTopic(values).then((ref) => {
            values.id = ref.id;
            topics.push(values);
            this.setState({
                topics: topics,
                visible: false
            }, () => {
                message.success("Successfully added tag")
            });
        }).catch(err => {
            message.error(err.message);
        });

    };

    onDelete = id => {
        const topics = this.state.topics;
        const index = topics.findIndex(tag => tag.id === id);
        deleteTopic(id).then(() => {
            topics.splice(index, 1);
            this.setState({
                topics: topics
            }, () => {
                message.success("Successfully deleted tag")
            });
        }).catch(err => {
            message.error(err.message);
        })
    };


    render() {
        const { i18n } = this.props;
        const { topics, visible, editView } = this.state;

        return (
            <div className="uk-padding">
                <div>
                    <Row>
                        <Col span={18}>
                            <div>
                                <Typography.Title level={4} className="section-header uk-text-bold">
                                    <Trans>
                                        Topics
                                    </Trans>
                                </Typography.Title>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="uk-text-right">
                                <Button className={"uk-margin-small-right"} type={"default"} onClick={() => this.setState({ editView: !editView })}>
                                    Editing View
                                </Button>
                                <Button type={"primary"} onClick={this.showDrawer}>
                                    Add tag
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Drawer
                    title="Add new tag"
                    placement="right"
                    closable={true}
                    onClose={this.onClose}
                    visible={visible}
                    width={500}
                >
                    <div>
                        <div>
                            <Form {...layout} onFinish={this.onFinish}>
                                <Form.Item
                                    label={"Тақырып"}
                                    name={"kz"}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input a valid email!"
                                        }
                                    ]}
                                >
                                    <Input placeholder={"Қазақша"} />
                                </Form.Item>

                                <Form.Item
                                    label={"Topic"}
                                    name={"en"}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input a valid email!"
                                        }
                                    ]}
                                >
                                    <Input placeholder={"English"} />
                                </Form.Item>

                                <Form.Item
                                    label={"Тема"}
                                    name={"ru"}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input a valid email!"
                                        }
                                    ]}
                                >
                                    <Input placeholder={"Русский"} />
                                </Form.Item>


                                <Form.Item className="uk-margin-top">
                                    <Button size={"large"} htmlType={"submit"} type="primary" block>
                                        <Trans>
                                             Add topic
                                        </Trans>
                                    </Button>
                                </Form.Item>

                            </Form>
                        </div>
                    </div>
                </Drawer>
                <div>
                    <List
                        className={"uk-margin-large-bottom"}
                        dataSource={topics}
                        renderItem={topic => (
                            <List.Item actions={editView ? [
                                <div className="uk-text-danger" onClick={() => this.onDelete(topic.id)}>
                                    Delete
                                </div>
                            ] : [] }>
                                { topic[i18n.language] }
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        );
    }
}


const enhance = compose(
    firestoreConnect(),
    connect()
);
export default enhance(withTranslation()(Topics));
