import React from "react";
import {Col, Form, Input, Row, Select, Typography} from "antd";
import { Trans, useTranslation } from "react-i18next";

const Contacts = ({}) => {
    const { t } = useTranslation();


    return (
        <Row gutter={[16, 0]}>
            <Col sm={24} md={8}>
                <Typography.Title level={4} className="section-title">
                    <Trans>
                        Additional info
                    </Trans>
                </Typography.Title>
                <Typography.Text>
                     <Trans>
                         Please enter your contact info, so admin can contact you before the approval. Also, write about yourself so other members can easily identify you
                     </Trans>
                </Typography.Text>
            </Col>
            <Col sm={24} md={16}>
                <Row gutter={[16, 0]}>
                    <Col sm={24} md={12}>
                        <Form.Item
                            name="phone"
                            label={t("Phone number")}
                            rules={[
                                {
                                    required: true,
                                    message: t("Required field"),
                                },
                                {
                                    len: 10,
                                    message: t("The input is not valid Phone"),
                                }
                            ]}
                        >
                            <Input addonBefore="+7" placeholder={t("Phone number")} />
                        </Form.Item>
                    </Col>


                    <Col sm={24} md={12}>
                        <Form.Item
                            name="location"
                            label={t("Current location")}
                            rules={[
                                {
                                    required: true,
                                    message: t("Required field"),
                                },
                            ]}
                        >
                            <Input placeholder={t("Current location")} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            name="about"
                            label={t("About you")}
                            rules={[
                                {
                                    required: true,
                                    message: t("Required field"),
                                },
                            ]}
                        >
                            <Input.TextArea placeholder={t("About you")} rows={4} />
                        </Form.Item>
                    </Col>
                </Row>

            </Col>
        </Row>
    )
}

export default Contacts;
