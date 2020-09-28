import React from "react";
import {Button, Col, DatePicker, Form, Input, message, Row, Select, Typography} from "antd";
import {Trans} from "react-i18next";
import moment from "moment";
import {getSaved, updateProfile, updateUser} from "../../functions/user";
import {handleFiles} from "../Helper/Handler";
const { TextArea } = Input
const { Option, OptGroup } = Select
const layout = {
    labelCol: { span : 24 },
    wrapperCol: { span: 24 }
}


class Account extends React.Component {

    state = {
        file: null,
        profile_url: this.props.user.info.avatar,
        user: this.props.user
    }


    updateProfile = (values) => {
        const { file, user } = this.state;
        const newValues = {
            info: {
                ...values.info,
                avatar: user.info.avatar
            }
        };
        updateProfile(file, newValues).then((updated) => {
            user.info = {
                ...user.info,
                ...updated.info
            };
            this.setState({
                user: user,
                file: null
            });
            message.success(
                <Trans>
                    Profile updated successfully
                </Trans>
            )
        }).catch(err => {
            message.error(err.message);
        })
    }


    updateJob = (values) => {
        const { user } = this.state;
        const newValues = values.work.map(value => {
            return {
                ...value,
                start: new Date(value.start),
                end: value.end ? new Date(value.end) : null
            }
        });
        console.log(newValues, values)
        updateUser(user.id, { work: newValues }).then(() => {
            user.work = newValues;
            this.setState({
                user: user
            })
            message.success(
                <Trans>
                    Profile updated successfully
                </Trans>
            )
        }).catch(err => {
            message.error(err.message);
        })
    }

    updateContacts = (values) => {
        const { user } = this.state;
        updateUser(user.id, values).then(() => {
            user.contacts = values.contacts;
            this.setState({
                user: user
            });
            message.success(
                <Trans>
                    Profile updated successfully
                </Trans>
            )
        }).catch(err => {
            message.error(err.message);
        })
    }


    updateInterests = (values) => {
        const { user } = this.state;
        updateUser(user.id, values).then(() => {
            user.interests = values.interests;
            this.setState({
                user: user
            });
            message.success(
                <Trans>
                    Profile updated successfully
                </Trans>
            )
        }).catch(err => {
            message.error(err.message);
        })
    }



    changePassword = (values) => {
        const { currentUser } = this.state;

        currentUser.updatePassword(values.password).then(() => {
            message.success(
                <Trans>
                    Password updated successfully
                </Trans>
            )
        }).catch(err => {
            message.error(err.message);
        })
    }


    handleFile = (e) => {
        const files = e.target.files;
        handleFiles(files, [], 0, 1, (urls) => {
            this.setState({
                file: files[0],
                profile_url: urls[0]
            })
        });
    }


    render() {

        const { file, profile_url } = this.state;
        const { user, t, tags, i18n } = this.props;

        return (
            <div>
                <div className={"uk-margin-top uk-padding"}>

                    <Form onFinish={this.updateProfile} {...layout} initialValues={user}>
                        <Typography.Title level={4} className="section-title">
                            <Trans>
                                General info
                            </Trans>
                        </Typography.Title>
                        <Row gutter={[16, 0]}>

                            <Col sm={24} md={16}>
                                <div>
                                    <Form.Item
                                        name={["info", "name"]}
                                        label={t("Full name")}
                                        className={"uk-margin-top"}
                                        rules={[
                                            {
                                                required: true,
                                                message: t("Required field"),
                                            }
                                        ]}
                                    >
                                        <Input placeholder={t("Full name")} />
                                    </Form.Item>
                                    <Form.Item
                                        className={"uk-margin-top"}
                                        label={t("Avatar")}
                                    >
                                        <div className="uk-width-1-1" uk-form-custom="true">
                                            <Input onChange={this.handleFile} type="file" placeholder={t("E-mail")} />
                                            <button className="uk-button uk-button-small uk-width-1-1" type="button"
                                                    tabIndex="-1">
                                                <Trans>
                                                    { file ? "Change" : "Choose"}
                                                </Trans>
                                            </button>
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        className={"uk-margin-top"}
                                        name={["info", "about"]}
                                        label={t("About")}
                                        rules={[
                                            {
                                                required: true,
                                                message: t("Required field"),
                                            }
                                        ]}
                                    >
                                        <TextArea autoSize={true}  placeholder={t("About")} />
                                    </Form.Item>
                                    <div className={"uk-margin-top"}>
                                        <Button htmlType="submit" type="primary">
                                            <Trans>
                                                Submit
                                            </Trans>
                                        </Button>
                                    </div>
                                </div>
                            </Col>


                            <Col sm={8} md={4}>
                                <div className="uk-text-center">
                                    <img className="uk-width-small uk-height-small uk-border-circle" src={profile_url ? profile_url : require("../Media/auth.png")}    />
                                </div>
                            </Col>
                        </Row>
                    </Form>

                    <hr />

                    <Form onFinish={this.changePassword} {...layout}>
                        <Typography.Title level={4} className="section-title">
                            <Trans>
                                Change password
                            </Trans>
                        </Typography.Title>
                        <Row gutter={[16, 0]}>
                            <Col sm={24} md={12}>
                                <Form.Item
                                    name="password"
                                    label={t("Password")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Required field"),
                                        },
                                        {
                                            pattern: new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"),
                                            message: t("Please enter safe password"),
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder={t("Password")} />
                                </Form.Item>
                            </Col>


                            <Col sm={24} md={12}>
                                <Form.Item
                                    name="confirm"
                                    label={t("Confirm password")}
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
                                    <Input.Password placeholder={t("Confirm password")} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div className={"uk-margin-top"}>
                            <Button htmlType="submit" type="primary">
                                <Trans>
                                    Submit
                                </Trans>
                            </Button>
                        </div>
                    </Form>

                    <hr />

                    <Form onFinish={this.updateContacts} {...layout} initialValues={user}>
                        <Typography.Title level={4} className="section-title">
                            <Trans>
                                Contacts
                            </Trans>
                        </Typography.Title>
                        <div>
                            <Form.List name="contacts" {...layout}>
                                {(fields, { add, remove }) => {
                                    return (
                                        <div className="uk-width-1-1 uk-margin-small-top">
                                            <Form.Item>
                                                <Row>
                                                    <Col span={12} className="uk-text-middle">
                                                        <Trans>
                                                            Contacts
                                                        </Trans>
                                                    </Col>
                                                    <Col span={12} className="uk-text-right">
                                                        <Button
                                                            onClick={() => {
                                                                add();
                                                            }}
                                                            shape="circle" icon={<span className="fas fa-plus" />}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                            {fields.map((field, index) => (
                                                <Form.Item
                                                    className={"uk-margin-top"}
                                                    name={[field.name, "data"]}
                                                    fieldKey={[field.fieldKey, "data"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: t("Required field")
                                                        }
                                                    ]}
                                                >
                                                    <Input addonAfter={
                                                        <a className={"uk-text-danger"}
                                                           onClick={() => {
                                                               remove(field.name);
                                                           }}>
                                                            <Trans>
                                                                Delete
                                                            </Trans>
                                                        </a>
                                                    } addonBefore={
                                                        <Form.Item
                                                            name={[field.name, "type"]}
                                                            fieldKey={[field.fieldKey, "type"]}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: t("Required field")
                                                                },
                                                            ]}
                                                            noStyle
                                                        >
                                                            <Select style={{ width: 70 }}>
                                                                <Option value="location">
                                                                    <i className={"fas fa-location-arrow"} />
                                                                </Option>
                                                                <Option value="phone">
                                                                    <i className={"fas fa-phone"} />
                                                                </Option>
                                                                <Option value="instagram">
                                                                    <i className={"fab fa-instagram"} />
                                                                </Option>
                                                                <Option value="telegram">
                                                                    <i className={"fab fa-telegram"} />
                                                                </Option>
                                                                <Option value="whatsapp">
                                                                    <i className={"fab fa-whatsapp"} />
                                                                </Option>
                                                                <Option value="vk">
                                                                    <i className={"fab fa-vk"} />
                                                                </Option>
                                                                <Option value="facebook">
                                                                    <i className={"fab fa-facebook"} />
                                                                </Option>
                                                            </Select>
                                                        </Form.Item>
                                                    } style={{ width: '100%' }} />
                                                </Form.Item>
                                            ))}
                                        </div>
                                    );
                                }}
                            </Form.List>
                            <div className={"uk-margin-top"}>
                                <Button htmlType="submit" type="primary">
                                    <Trans>
                                        Submit
                                    </Trans>
                                </Button>
                            </div>
                        </div>
                    </Form>

                    <hr />

                    <Form onFinish={this.updateJob} {...layout} initialValues={{ work: user.work ? user.work.map(job => {
                            return {
                                ...job,
                                start: moment(new Date(job.start.seconds*1000)),
                                end: job.end ? moment(new Date(job.end.seconds*1000)) : undefined
                            }
                        }) : [] }}>
                        <Typography.Title level={4} className="section-title">
                            <Trans>
                                Work experience
                            </Trans>
                        </Typography.Title>
                        <div>
                            <Form.List name="work" {...layout}>
                                {(fields, { add, remove }) => {
                                    return (
                                        <div className="uk-width-1-1 uk-margin-small-top">
                                            <Form.Item>
                                                <Row>
                                                    <Col span={12} className="uk-text-middle">
                                                        <Trans>
                                                            Work experience
                                                        </Trans>
                                                    </Col>
                                                    <Col span={12} className="uk-text-right">
                                                        <Button
                                                            onClick={() => {
                                                                add();
                                                            }}
                                                            shape="circle" icon={<span className="fas fa-plus" />}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                            {fields.map((field, index) => (
                                                <Row gutter={[8, 8]}>
                                                    <Col span={12} className="uk-text-middle uk-text-bolder uk-text-emphasis">
                                                        Work {field.name+1}
                                                    </Col>
                                                    <Col span={12} className="uk-text-right">
                                                        <Button size={"small"} type="danger"
                                                                onClick={() => {
                                                                    remove(field.name);
                                                                }}>
                                                            <Trans>
                                                                Delete
                                                            </Trans>
                                                        </Button>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item
                                                            className={"uk-margin-top"}
                                                            name={[field.name, "start"]}
                                                            fieldKey={[field.fieldKey, "start"]}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: t("Required field")
                                                                }
                                                            ]}
                                                        >
                                                            <DatePicker locale={i18n.language} format="YYYY-MM-DD" style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item
                                                            className={"uk-margin-top"}
                                                            name={[field.name, "end"]}
                                                            fieldKey={[field.fieldKey, "end"]}
                                                        >

                                                            <DatePicker locale={i18n.language} format="YYYY-MM-DD" style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={24}>
                                                        <div>
                                                            <Form.Item
                                                                className={"uk-margin-top"}
                                                                name={[field.name, "company"]}
                                                                fieldKey={[field.fieldKey, "company"]}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: t("Required field")
                                                                    }
                                                                ]}
                                                            >
                                                                <Input placeholder={t("Company")}  />
                                                            </Form.Item>
                                                        </div>
                                                    </Col>
                                                    <Col span={24}>
                                                        <div>
                                                            <Form.Item
                                                                className={"uk-margin-top"}
                                                                name={[field.name, "position"]}
                                                                fieldKey={[field.fieldKey, "position"]}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: t("Required field")
                                                                    }
                                                                ]}
                                                            >
                                                                <Input placeholder={t("Position")}  />
                                                            </Form.Item>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </div>
                                    );
                                }}
                            </Form.List>
                            <div className={"uk-margin-top"}>
                                <Button htmlType="submit" type="primary">
                                    <Trans>
                                        Submit
                                    </Trans>
                                </Button>
                            </div>
                        </div>
                    </Form>

                    <hr />


                    <Form onFinish={this.updateInterests} {...layout} initialValues={user} >
                        <Typography.Title level={4} className="section-title">
                            <Trans>
                                Interests
                            </Trans>
                        </Typography.Title>
                        <div>
                            <Form.List name={["interests", "offers"]} {...layout}>
                                {(fields, { add, remove }) => {
                                    return (
                                        <div className="uk-width-1-1 uk-margin-small-top">
                                            <Form.Item>
                                                <Row>
                                                    <Col span={12} className="uk-text-middle">
                                                        <Trans>
                                                            Offers
                                                        </Trans>
                                                    </Col>
                                                    <Col span={12} className="uk-text-right">
                                                        <Button
                                                            onClick={() => {
                                                                add();
                                                            }}
                                                            shape="circle" icon={<span className="fas fa-plus" />}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                            {fields.map((field, index) => (
                                                <div>
                                                    <Form.Item
                                                        className={"uk-margin-top"}
                                                        name={field.name}
                                                        fieldKey={field.fieldKey}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: t("Required field")
                                                            }
                                                        ]}
                                                    >
                                                        <Select  style={{ width: '100%' }}>
                                                            { tags.filter(parent => parent.parent===null).map(parent => (
                                                                <OptGroup label={parent.value[i18n.language]}>
                                                                    { tags.filter(tag => tag.parent===parent.id).map(tag => (
                                                                        <Option value={tag.id}>{tag.value[i18n.language]}</Option>
                                                                    ))}
                                                                </OptGroup>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                    <a className={"uk-text-danger"}
                                                       onClick={() => {
                                                           remove(field.name);
                                                       }}>
                                                        <Trans>
                                                            Delete
                                                        </Trans>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }}
                            </Form.List>

                            <Form.List name={["interests", "needs"]} {...layout}>
                                {(fields, { add, remove }) => {
                                    return (
                                        <div className="uk-width-1-1 uk-margin-small-top">
                                            <Form.Item>
                                                <Row>
                                                    <Col span={12} className="uk-text-middle">
                                                        <Trans>
                                                            Needs
                                                        </Trans>
                                                    </Col>
                                                    <Col span={12} className="uk-text-right">
                                                        <Button
                                                            onClick={() => {
                                                                add();
                                                            }}
                                                            shape="circle" icon={<span className="fas fa-plus" />}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                            {fields.map((field, index) => (
                                                <div>
                                                    <Form.Item
                                                        className={"uk-margin-top"}
                                                        name={field.name}
                                                        fieldKey={field.fieldKey}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: t("Required field")
                                                            }
                                                        ]}
                                                    >
                                                        <Select  style={{ width: '100%' }}>
                                                            { tags.filter(parent => parent.parent===null).map(parent => (
                                                                <OptGroup label={parent.value[i18n.language]}>
                                                                    { tags.filter(tag => tag.parent===parent.id).map(tag => (
                                                                        <Option value={tag.id}>{tag.value[i18n.language]}</Option>
                                                                    ))}
                                                                </OptGroup>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                    <a className={"uk-text-danger"}
                                                       onClick={() => {
                                                           remove(field.name);
                                                       }}>
                                                        <Trans>
                                                            Delete
                                                        </Trans>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }}
                            </Form.List>


                            <div className={"uk-margin-top"}>
                                <Button htmlType="submit" type="primary">
                                    <Trans>
                                        Submit
                                    </Trans>
                                </Button>
                            </div>
                        </div>
                    </Form>

                </div>
            </div>
        )
    }
}

export default Account;