import React from "react";
import {Col, Dropdown, Form, Input, Menu, Row, Select, Tabs, Tag, Typography} from "antd";
import {Trans, useTranslation} from "react-i18next";
import "../User/auth.css"
const { TabPane } = Tabs;
const { CheckableTag } = Tag;


const Needs = ({ tags, handleTag, needs }) => {
    const { t, i18n } = useTranslation();

    return (
        <Row gutter={[16, 0]}>
            <Col sm={24} md={8}>
                <Typography.Title level={4} className="section-title">
                    <Trans>
                        What you need
                    </Trans>
                </Typography.Title>
                <Typography.Text>
                    <Trans>
                        <Trans>
                            Choose areas where you are interested in or need help
                        </Trans>
                    </Trans>
                </Typography.Text>
                <div>
                    <span className="tag uk-text-bolder" style={{ marginRight: 8 }}>List:</span>
                    {needs.map(item => (
                        <CheckableTag
                            key={item}
                            onChange={checked => handleTag(item, "needs")}
                        >
                            {tags.find(tag => tag.id===item).value[i18n.language]}
                        </CheckableTag>
                    ))}
                </div>
            </Col>
            <Col sm={24} md={16}>
                <div className="auth-tabs">
                    <Tabs type="card" defaultActiveKey="1" tabPosition="top" style={{ height: 220 }}>
                        { tags.filter(tag => tag.parent===null).map(category => (
                            <TabPane tab={category.value[i18n.language]} key={category.id}>
                                { tags.filter(tag => tag.parent===category.id).map(tag => (
                                    <CheckableTag
                                        key={tag.id}
                                        checked={needs.indexOf(tag.id) > -1}
                                        color="#5856d6"
                                        onChange={checked => handleTag(tag.id, "needs")}
                                    >
                                        {tag.value[i18n.language]}
                                    </CheckableTag>
                                ))}
                            </TabPane>
                        ))}
                    </Tabs>
                </div>
            </Col>
        </Row>
    )
}

export default Needs;
