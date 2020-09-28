import React from "react";
import {List, Drawer, Row, Col, Form, Input, Button, Select, Divider, Typography, message, Popconfirm} from 'antd';
import {createTag, deleteTag} from "../../functions/admin";
import { firestoreConnect } from "react-redux-firebase";
import {connect} from "react-redux";
import {compose} from "redux";
import {Trans, withTranslation} from "react-i18next";
import {getTags} from "../../functions/post";

const { Option } = Select;
const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

class Tags extends React.Component {

    state = {
        visible: false,
        tags: [],
        editView: false
    };


    componentDidMount() {
        getTags().then(tags => {
            this.setState({
                tags: tags
            })
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
        const tags = this.state.tags;
        const tag = {
            ...values,
            parent: values.parent ? values.parent : null
        };
        createTag(tag).then((ref) => {
            tag.id = ref.id;
            tags.push(tag);
            this.setState({
                tags: tags,
                visible: false
            }, () => {
                message.success("Successfully added tag")
            });
        }).catch(err => {
            message.error(err.message);
        });

    };

    onDelete = id => {
        const tags = this.state.tags;
        const index = tags.findIndex(tag => tag.id === id);
        deleteTag(id).then(() => {
            tags.splice(index, 1);
            this.setState({
                tags: tags
            }, () => {
                message.success("Successfully deleted tag")
            });
        }).catch(err => {
            message.error(err.message);
        })
    };


    render() {
        const { i18n } = this.props;
        const { tags, visible, editView } = this.state;
        const parents = tags.filter(tag => tag.parent===null);

        return (
            <div className="uk-padding">
                <div>
                    <Row>
                        <Col span={18}>
                            <div>
                                <Typography.Title level={4} className="section-header uk-text-bold">
                                    <Trans>
                                        Tags
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
                                    label={"Тег"}
                                    name={["value", "kz"]}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input a valid email!"
                                        }
                                    ]}
                                >
                                    <Input placeholder={"Тег аты"} />
                                </Form.Item>

                                <Form.Item
                                    label={"Tag"}
                                    name={["value", "en"]}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input a valid email!"
                                        }
                                    ]}
                                >
                                    <Input placeholder={"Title"} />
                                </Form.Item>

                                <Form.Item
                                    label={"Тег"}
                                    name={["value", "ru"]}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input a valid email!"
                                        }
                                    ]}
                                >
                                    <Input placeholder={"Название"} />
                                </Form.Item>

                                <Form.Item
                                    label={"Тег"}
                                    name={"parent"}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select a parent"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option value={null}>Не выбрано</Option>
                                        { parents.map(parent => (
                                            <Option value={parent.id}>{parent.value[i18n.language]}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item className="uk-margin-top">
                                    <Button size={"large"} htmlType={"submit"} type="primary" block>
                                        <Trans>
                                             Add tag
                                        </Trans>
                                    </Button>
                                </Form.Item>

                            </Form>
                        </div>
                    </div>
                </Drawer>
                <div>
                    { parents.map(parent => (
                        <List
                            className={"uk-margin-large-bottom"}
                            header={
                                <Row>
                                    <Col span={20}>
                                        <div>
                                            <small className={"uk-text-primary uk-text-uppercase uk-text-bold"}>
                                                { parent.value[i18n.language] } • { tags.filter(tag => tag.parent===parent.id).length }
                                            </small>
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        { editView ? (
                                            <div className="uk-text-right">
                                                <Popconfirm
                                                    title={"Delete parent tag?"}
                                                    onConfirm={() => this.onDelete(parent.id)}
                                                >
                                                    <a className="uk-text-danger">
                                                        Delete
                                                    </a>
                                                </Popconfirm>
                                            </div>
                                        ) : null }
                                    </Col>
                                </Row>

                            }
                            dataSource={tags.filter(tag => tag.parent===parent.id)}
                            renderItem={tag => (
                                <List.Item actions={editView ? [
                                    <div className="uk-text-danger" onClick={() => this.onDelete(tag.id)}>
                                        Delete
                                    </div>
                                ] : [] }>
                                    { tag.value[i18n.language] }
                                </List.Item>
                            )}
                        />
                    ))}
                </div>
            </div>
        );
    }
}


const enhance = compose(
    firestoreConnect(),
    connect()
);
export default enhance(withTranslation()(Tags));
