import React from "react";
import {Trans} from "react-i18next";
import {Avatar, Button, Col, Form, Input, List, message, Row, Typography} from "antd";
import UIkit from "uikit";
import {getItems} from "../../functions/admin";
import {createOrder, getCard, updateCard} from "../../functions/user";
import {Link} from "react-router-dom";


class Shop extends React.Component {
    state = {
        items: [],
        card: [],
        currentUser: this.props.firebase.auth().currentUser,
    }


    componentDidMount() {
        getItems().then(items => {
            this.setState({
                items: items.map(item => {
                    return {
                        ...item,
                        count: 1,
                        selectedSize: item.sizes[0]
                    }
                })
            });
        });
        if(this.state.currentUser){
            getCard().then(card => {
                this.setState({
                    card: card.items ? card.items : []
                });
            });
        }

    }


    addToCard = (id) => {
        const { items, card } = this.state;
        const item = items.find(i => i.id===id);
        const index = card.findIndex(i => i.id===id && i.selectedSize===item.selectedSize);
        const newItem = {
            ...item,
            count: item.count,
            selectedSize: item.selectedSize
        };
        if(index >= 0) {
            card[index] = newItem;
        } else {
            card.push(newItem);
        }
        updateCard(card).then(() => {
            this.setState({
                card: card
            });
        });
    }


    order = values => {
        createOrder(this.state.card, values.location).then(() => {
            message.success(<Trans>Successfully created order</Trans>)
        }).catch(() => {
            message.error(<Trans>Failed to create order</Trans>)
        })
    }

    removeFromCard = (id) => {
        const { card } = this.state;
        const index = card.findIndex(i => i.id === id);
        card.splice(index, 1);
        updateCard(card).then(() => {
            this.setState({
                card: card
            });
        });
    }

    increment = (item, value) => {
        const { items } = this.state;
        const index = items.indexOf(item);
        if(item.count > 1 || value > 0) {
            items[index].count += value;
            this.setState({
                items: items
            });
        }
    }

    selectSize = (item, size) => {
        const { items } = this.state;
        const index = items.indexOf(item);
        items[index].selectedSize = size;
        this.setState({
            items: items
        });
    }


    render() {
        const { i18n, t } = this.props;
        const { items, card, currentUser } = this.state;


        return (
            <div className="uk-background-muted uk-padding uk-padding-remove-horizontal">
                <div className={"uk-container uk-container-large"}>
                    <Row gutter={[16, 16]}>
                        <Col sm={24} md={16}>
                            <div>
                                <Typography.Title level={3} className="section-header uk-text-bold uk-margin-remove">
                                    <Trans>
                                        Merch
                                    </Trans>
                                </Typography.Title>
                                <h5 level={5} className="section-meta uk-text-muted uk-margin-remove">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                                </h5>

                                <div>
                                    <Row gutter={[16, 16]}>
                                        { items.map(item => (
                                            <Col sm={24} md={12}>
                                                <div className={"uk-border-rounded uk-background-default"}>
                                                    <div>
                                                        <div uk-slideshow="true">
                                                            <div className="uk-position-relative uk-visible-toggle uk-light"
                                                                 tabIndex="-1">
                                                                <ul className="uk-slideshow-items">
                                                                    { item.urls.map(image => (
                                                                        <li className="uk-text-center uk-background-muted">
                                                                            <img className="uk-border-rounded uk-height-large uk-width-1-1" src={image.url}  onClick={() =>
                                                                                UIkit.lightboxPanel({
                                                                                    items : item.urls.map(image => {
                                                                                        return {
                                                                                            source: image.url,
                                                                                            type: "image",
                                                                                            caption: image.name
                                                                                        }
                                                                                    }),
                                                                                    index: item.urls.indexOf(image)
                                                                                }).show()} />
                                                                        </li>
                                                                    )) }
                                                                </ul>

                                                                <a className="uk-position-center-left uk-position-small uk-hidden-hover"
                                                                   href="#" uk-slidenav-previous="true"
                                                                   uk-slideshow-item="previous" />
                                                                <a className="uk-position-center-right uk-position-small uk-hidden-hover"
                                                                   href="#" uk-slidenav-next="true" uk-slideshow-item="next" />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={"uk-padding-small"}>
                                                        <h5>
                                                            { item.title[i18n.language] }
                                                        </h5>
                                                        <h4>
                                                            { item.price }
                                                        </h4>
                                                        <p>
                                                            { item.details[i18n.language] }
                                                        </p>

                                                        <div className={"uk-margin-bottom"}>
                                                            { item.sizes.map(size => (
                                                                <Button type={item.selectedSize===size ?  "primary" : "default"} className="uk-margin-small-bottom uk-margin-small-right" onClick={() => this.selectSize(item, size)} >
                                                                    {size}
                                                                </Button>
                                                            ))}
                                                        </div>

                                                        <Row className={"uk-margin-bottom"}>
                                                            <Col span={2}>
                                                                <div>
                                                                    <Button onClick={() => this.increment(item, 1)} icon={<span uk-icon={"plus"} />} />
                                                                </div>
                                                            </Col>
                                                            <Col span={6}>
                                                                <div className={"uk-text-center uk-text-bold"}>
                                                                    { item.count }
                                                                </div>
                                                            </Col>
                                                            <Col span={2}>
                                                                <div>
                                                                    <Button onClick={() => this.increment(item, -1)} icon={<span uk-icon={"minus"} />} />
                                                                </div>
                                                            </Col>
                                                            <Col span={2}>

                                                            </Col>
                                                            <Col span={12}>
                                                                <div>
                                                                    <Button onClick={() => this.addToCard(item.id)} type={"primary"} block>
                                                                        <Trans>
                                                                            Add to basket
                                                                        </Trans>
                                                                    </Button>
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </div>
                        </Col>
                        {currentUser ? (
                            <Col sm={24} md={8}>
                                <div>
                                    <Row>
                                        <Col span={12}>
                                            <div>
                                                <Typography.Title level={4} className="uk-text-bold">
                                                    <Trans>
                                                        Basket
                                                    </Trans>
                                                </Typography.Title>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className={"uk-text-right"}>
                                                <Link to={`users/${currentUser.uid}`}>
                                                    <Typography.Title level={4}>
                                                        <Trans>
                                                            All orders
                                                        </Trans>
                                                    </Typography.Title>
                                                </Link>
                                            </div>
                                        </Col>
                                    </Row>


                                    <div>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={card}
                                            renderItem={item => (
                                                <List.Item actions={[
                                                    <a onClick={() => this.removeFromCard(item.id)}>
                                                        <Trans>
                                                            Delete
                                                        </Trans>
                                                    </a>
                                                ]}>
                                                    <List.Item.Meta
                                                        avatar={<Avatar size="large" shape="square" src={item.urls[0].url} />}
                                                        title={ item.title[i18n.language] }
                                                        description={`${ item.selectedSize } • ${ item.count }`}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </div>

                                    <hr />

                                    <div>
                                        <Form onFinish={this.order}>
                                            <Form.Item rules={[{ required: true }]} name="location" label={t("Address")}>
                                                <Input placeholder={t("Address")} />
                                            </Form.Item>
                                            <Form.Item className={"uk-margin-small-top"}>
                                                <Button size={"large"} htmlType={"submit"} type={"primary"} block>
                                                    <Trans>
                                                        Order online
                                                    </Trans>
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </div>
                            </Col>
                        ) : null}
                    </Row>
                </div>
            </div>
        );
    }
}


export default Shop;