import React from "react";
import {Col, Form, Input, Row, Select, Typography} from "antd";
import {Trans, useTranslation} from "react-i18next";
const { Option, OptGroup } = Select;


const allSchools = {
    "Atyrau": [
        "Zhylyoy Lyceum Bilim Innovation",
        "Atyrau Lyceum Bilim Innovation for Boys"
    ],
    "Shymkent": [
        "Shymkent Lyceum Bilim Innovation for Boys",
        "Shymkent boarding school bilim innovation for gifted girls No. 2"
    ],
    "Taraz": [
        "Taraz Lyceum Bilim Innovation",
        "Taraz College Bilim Innovation №26",
        "Taraz boarding school Bilim Innovation them. Aisha Bibi"
    ],
    "Semey": [
        "Semey Lyceum Bilim Innovation"
    ],
    "Karagandy": [
        "Karagandy Lyceum Bilim Innovation for Girls",
        "Karagandy Lyceum Bilim Innovation for Boys",
        "Zhezkazgan Lyceum Bilim Innovation"
    ],
    "Kokshetau": [
        "Kokshetau Lyceum Bilim Innovation"
    ],
    "Kentau": [
        "Kentau Lyceum Bilim Innovation for Boys"
    ],
    "Almaty": [
        "Yessik Lyceum Bilim Innovation",
        "Almaty Lyceum Bilim Innovation for Boys ",
        "Taldykorgan youth lyceum Bilim Innovation"
    ],
    "Nursultan": [
        "Astana Lyceum Bilim Innovation for Girls",
        "Astana Lyceum Bilim Innovation for Boys"
    ],
    "Mangystau": [
        "Aktau Lyceum Bilim Innovation",
        "Zhanaozen Lyceum Bilim Innovation"
    ],
    "Aktobe": [
        "Aktobe Lyceum Bilim Innovation"
    ],
    "Kyzylorda": [
        "Kyzylorda Lyceum-Boarding School bilim innovation for gifted children",
        "Kyzylorda Lyceum Bilim Innovation for Gifted Girls"
    ],
    "Kostanay": [
        "Kostanay Lyceum Bilim Innovation for Gifted Children"
    ],
    "Ural": [
        "The Ural Lyceum Bilim Innovation"
    ],
    "Ust-Kamenogorsk": [
        "Ust-Kamenogorsk Lyceum Bilim Innovation for Gifted Young Men"
    ],
    "Pavlodar": [
        "Pavlodar Lyceum Beim Innovation for Boys",
        "Pavlodar Lyceum Bilim Innovation for Girls"
    ],
    "Petropavlovsk": [
        "Petropavlovsk high school bilim innovation"
    ]
}


const Relation = ({ }) => {
    const { t } = useTranslation();


    return (
        <Row gutter={[16, 0]}>
            <Col sm={24} md={8}>
                <Typography.Title level={4} className="section-title">
                    <Trans>
                        Relation to KATEV
                    </Trans>
                </Typography.Title>
                <Typography.Text>
                    <Trans>
                        Please specify your relation to the KATEV. If you are just interested then choose "Other" and specify the reason in the about text area
                    </Trans>
                </Typography.Text>
            </Col>
            <Col sm={24} md={16}>
                <Row gutter={[16,0]}>
                    <Col span={24}>
                        <Form.Item
                            name="relation"
                            label={t("Relation to KATEV")}
                            rules={[{ required: true, message: t("Required field"), }]}
                        >
                            <Select placeholder={t("Relation to KATEV")}>
                                <Option value="mezun">
                                    <Trans>
                                        Studies/Studied at KTL/BIL
                                    </Trans>
                                </Option>
                                <Option value="relative">
                                    <Trans>
                                        Relative to KTLian/BILean
                                    </Trans>
                                </Option>
                                <Option value="friend">
                                    <Trans>
                                        Friend to KTLian/BILean
                                    </Trans>
                                </Option>
                                <Option value="other">
                                    <Trans>
                                        Other
                                    </Trans>
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col sm={24} md={12}>
                        <Form.Item
                            name="relative_name"
                            label={t("Relative's first and second name")}
                            rules={[
                                {
                                    required: true,
                                    message: t("Required field"),
                                }
                            ]}
                        >
                            <Input placeholder={t("Relative's first and second name")} />
                        </Form.Item>
                    </Col>
                    <Col sm={24} md={12}>
                        <Form.Item
                            name="relative_phone"
                            label={t("Relative's phone")}
                        >
                            <Input addonBefore="+7" placeholder={t("Relative's phone")} />
                        </Form.Item>
                    </Col>
                    <Col sm={24} md={16}>
                        <Form.Item
                            name="relative_school"
                            label={t("Relative's graduated school")}
                            rules={[{ required: true, message: t("Required field") }]}
                        >
                            <Select placeholder={t("Relative's graduated school")}>
                                { Object.entries(allSchools).map(city => (
                                    <OptGroup label={t(city[0]).toUpperCase()}>
                                        { city[1].map(school => (
                                            <Option value={school}>
                                                { t(school) }
                                            </Option>
                                        ))}
                                    </OptGroup>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col sm={24} md={8}>
                        <Form.Item
                            name="relative_year"
                            label={t("Relative's graduation year")}
                            rules={[{ required: true, message: t("Required field") }]}
                        >
                            <Select placeholder={t("Relative's graduation year")}>
                                { [...Array(new Date().getFullYear() - 1997).keys()].map(i => (
                                    <Option value={i + 1997}>{i + 1997}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="relative_details"
                            label={t("Additional about relative")}
                        >
                            <Input.TextArea placeholder={t("Additional about relative")} rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Relation;
