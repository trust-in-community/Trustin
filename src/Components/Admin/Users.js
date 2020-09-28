import React from "react";
import {message, Table, Input, Typography, List, Button, Skeleton, Avatar} from 'antd';
import {getRequests, respondRequest} from "../../functions/admin";
import {Trans} from "react-i18next";
import { Link } from "react-router-dom";
import {searchPeople} from "../../functions/chat";
const { Search } = Input;


class Users extends React.Component {

    state = {
        users: [],
        loading: true,
        allLoaded: false,
        name: null
    }

    componentDidMount() {
        this.loadUsers();
    }

    loadUsers = () => {
        const { users, name } = this.state;
        if(name) {
            searchPeople(users.length > 0 ? users[users.length - 1].status : null, name).then(newUsers => {
                this.setState({
                    users: [...users, ...newUsers],
                    allLoaded: newUsers.length < 20,
                    loading: false
                })
            })
        } else {
            getRequests(users.length > 0 ? users[users.length - 1].status : null).then(newUsers => {
                this.setState({
                    users: [...users, ...newUsers],
                    allLoaded: newUsers.length < 20,
                    loading: false
                })
            })
        }
    }


    respondRequest = (id, responce) => {
        const users = this.state.users;
        respondRequest(id, responce).then(() => {
            const index = this.state.users.findIndex(user => user.id === id);
            users[index].status = responce;
            this.setState({
                users: users
            });
        }).catch(err => {
            message.error(err.message);
        })
    }


    onSearch = (value) => {
        if(value && value.length > 0) {
            this.setState({
                name: value,
                users: [],
                loading: true,
                allLoaded: false
            });
            searchPeople(null, value).then(users => {
                this.setState({
                    users: users,
                    allLoaded: users.length < 20,
                    loading: false
                })
            })
        } else {
            this.setState({
                name: null,
                users: [],
                loading: true,
                allLoaded: false
            }, () => {
                this.loadUsers()
            });
        }
    }


    render() {
        const { users, allLoaded, loading } = this.state;

        const loadMore =
        !allLoaded && !loading ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={this.loadUsers}>Load more</Button>
            </div>
        ) : null;

        return (
            <div className={"uk-padding"}>
                <div>
                    <Typography.Title level={4} className="section-header uk-text-bold">
                        <Trans>
                            Users
                        </Trans>
                    </Typography.Title>
                    <div>
                        <Search
                            placeholder="Search users"
                            onSearch={this.onSearch}
                        />
                    </div>
                </div>
                <List
                    loading={loading}
                    itemLayout="horizontal"
                    loadMore={loadMore}
                    dataSource={users}
                    renderItem={user => (
                        <List.Item
                            actions={[
                                <div className={ user.status === "pending" ? "uk-label" : "uk-label uk-label-warning"} onClick={() => this.respondRequest(user.id, user.status === "pending" ? "verified" : "pending")}>
                                    { user.status === "pending" ? "Confirm" : "Pending" }
                                </div>,
                                <div className="uk-label uk-label-danger" onClick={() => this.respondRequest(user.id, "rejected")}>
                                    Reject
                                </div>
                            ]}
                        >
                            <Skeleton avatar title={false} loading={user.loading} active>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar size={64} src={user.info.avatar} />
                                    }
                                    title={
                                        <h4 className={"uk-margin-remove"}>
                                            <Link to={`/users/${user.id}`}>
                                                {user.info.first_name} {user.info.second_name}
                                            </Link>
                                        </h4>
                                    }
                                    description={
                                        <div>
                                            <small className={"uk-text-primary uk-text-uppercase uk-text-bold"}>
                                                { user.relation.type } • { user.status }
                                            </small>
                                            <Typography.Paragraph ellipsis={{ expandable: false, rows: 3 }} className="uk-margin-remove">
                                                { user.info.about }
                                            </Typography.Paragraph>
                                        </div>
                                    }
                                />
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}


export default Users;
