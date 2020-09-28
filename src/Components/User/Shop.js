import React from "react";
import {getOrders, updateOrder} from "../../functions/user";
import {Badge, Button, message, Table} from "antd";
import { Trans } from "react-i18next";
import moment from "moment";
import {loadingView} from "../../functions/helper";
import {Link} from "react-router-dom";


class Shop extends React.Component {

    state = {
        orders: [],
        currentUser: this.props.currentUser,
        loading: true,
        allLoaded: false
    }

    componentDidMount() {
        this.getOrders(null);
    }

    getOrders = (startAfter = null) => {
        getOrders(startAfter).then(orders => {
            this.setState({
                orders: [...this.state.orders, ...orders],
                loading: false,
                allLoaded: orders.length < 20
            });
        }).catch(() => {
            this.setState({
                loading: false
            });
        });
    }

    loadMore = () => {
        const { orders } = this.state;
        this.setState({
            loading: true
        }, () => {
            this.getOrders(orders[orders.length-1].createdAt);
        });
    }


    updateOrder = (id, state) => {
        const { orders } = this.state;
        const index = orders.findIndex(o => o.id === id);
        updateOrder(id, {state: state}).then(r => {
            orders[index].state = state
            this.setState({
                orders: orders
            });
            message.success(<Trans>Order changed to {state}</Trans>);
        });
    }


    render() {
        const { orders, allLoaded, loading } = this.state;
        const { t, i18n, isAdmin } = this.props;
        const endStates = ["cancelled", "done", "declined"];
        const status = {
            "cancelled": "error",
            "declined": "error",
            "done": "success",
            "pending": "processing",
            "accepted": "warning"
        };
        const actionButton = (order) => {
            if(isAdmin && order.state==="pending"){
                return [
                    <a onClick={() => this.updateOrder(order.id, "accepted")} className={"main-color"} ><Trans>Accept</Trans></a>,
                    <a onClick={() => this.updateOrder(order.id, "declined")} className={"uk-text-danger"} ><Trans>Reject</Trans></a>
                ]
            } else if (isAdmin && order.state==="accepted") {
                return [
                    <a onClick={() => this.updateOrder(order.id, "done")} className={"main-color"} ><Trans>Done</Trans></a>
                ]
            } else if (!endStates.includes(order.state)) {
                return [<a onClick={() => this.updateOrder(order.id, "cancelled")} className={"uk-text-danger"} ><Trans>Cancel</Trans></a>]
            } else {
                return [];
            }
        }
        const columns = [
            { title: t('Created at'), dataIndex: 'createdAt', render: (createdAt) => moment(createdAt.seconds*1000).format("LLL")},
            { title: t('Status'), dataIndex: 'state', render: (state) => <Badge status={status[state]}  text={ t(state).toUpperCase() } />},
            { title: t('Location'), dataIndex: 'location', key: 'location' },
            { title: t('Action'), render: (order) => actionButton(order) }
        ];
        if(isAdmin) {
            columns.push({ title: 'Author', render: (order) => <Link to={`users/${order.author.uid}`}>{order.author.name}</Link> })
        }

        const insideColumns = [
            { title: t('Title'), dataIndex: `title`, render: (title) => title[i18n.language]},
            { title: t('Price/item'), dataIndex: 'price', key: 'price' },
            { title: t('Size'), dataIndex: 'selectedSize', key: 'selectedSize' },
            { title: t('Count'), dataIndex: 'count', key: 'count' },
            { title: t('Price'), render: (item) => item.count*item.price }
        ];


        return (
            <div>
                <h3 level={3} className={"uk-margin-top uk-margin-bottom"}>
                    <Trans>
                        Orders
                    </Trans>
                </h3>
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    expandable={{
                        expandedRowRender: order => (
                            <div>
                                <Table columns={insideColumns} dataSource={order.items} pagination={false}/>
                            </div>
                        )
                    }}
                    dataSource={orders}
                />

                { loading ? loadingView :
                    <div className="uk-text-center">
                        { allLoaded ? null :
                            <Button onClick={this.loadMore} type="primary">
                                <Trans>
                                    Load more
                                </Trans>
                            </Button>
                        }
                    </div>
                }
            </div>
        )
    }
}


export default Shop;