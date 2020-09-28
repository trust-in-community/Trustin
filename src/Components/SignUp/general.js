import React from "react";
import {Col, Form, Input, Row, Select, Typography} from "antd";
import {Trans, useTranslation} from "react-i18next";
const { Option } = Select;

const General = ({ file, handleFile, profile_url }) => {
    const { t } = useTranslation();

    return (
        <Row gutter={[16, 0]}>
            <Col sm={24} md={8}>
                <Typography.Title level={4} className="section-title">
                    <Trans>
                        General info
                    </Trans>
                </Typography.Title>
                <Typography.Text>
                    <Trans>
                        Please enter proper info and image, admin will check and approve your account data if only it is correct. Also, please enter safe password to protect your privacy
                    </Trans>
                </Typography.Text>
            </Col>
            <Col sm={24} md={16}>
                <Row gutter={[16, 0]}>

                    <Col sm={24} md={16}>

                        <Row gutter={[16, 0]}>
                            <Col span={24}>
                                <Form.Item
                                    name="name"
                                    label={t("Full name")}
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
                                    name="email"
                                    label={t("E-mail")}
                                    rules={[
                                        {
                                            type: 'email',
                                            message: t("Please input a valid email!"),
                                        },
                                        {
                                            required: true,
                                            message: t("Please input a valid email!"),
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("E-mail")} />
                                </Form.Item>
                            </Col>

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

                            <Col span={8}>
                                <Form.Item
                                    name="avatar"
                                    label={t("Avatar")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Required field"),
                                        }
                                    ]}
                                >
                                    <div className="uk-width-1-1" uk-form-custom="true">
                                        <Input onChange={handleFile} type="file" placeholder={t("E-mail")} />
                                        <button className="uk-button uk-button-small uk-width-1-1" type="button"
                                                tabIndex="-1">
                                            <Trans>
                                                { file ? "Change" : "Choose"}
                                            </Trans>
                                        </button>
                                    </div>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="year"
                                    label={t("Birth year")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Required field"),
                                        },
                                    ]}
                                >
                                    <Input type="number" min="1945" max={`${new Date().getFullYear() - 12}`} placeholder={t("Birth year")} />
                                </Form.Item>
                            </Col>


                            <Col span={8}>
                                <Form.Item
                                    name="gender"
                                    label={t("Gender")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Required field"),
                                        },
                                    ]}
                                >
                                    <Select placeholder={t("Gender")}>
                                        <Option value="male">
                                            <Trans>
                                                Male
                                            </Trans>
                                        </Option>
                                        <Option value="female">
                                            <Trans>
                                                Female
                                            </Trans>
                                        </Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>


                    <Col sm={24} md={8}>
                        <div className="uk-text-center uk-margin-top">
                            <div className="uk-inline uk-text-center">
                                <img className="uk-width-small uk-height-small uk-border-circle" src={profile_url ? profile_url : require("../Media/auth.png")}    />
                            </div>
                        </div>
                    </Col>

                </Row>
            </Col>
        </Row>
    )
}

export default General;
