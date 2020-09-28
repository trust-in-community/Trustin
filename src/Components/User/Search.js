import React from "react";
import {
    Rate,
    Input,
    Typography,
    Row,
    Col,
    Collapse,
    Avatar,
    List,
    Button,
    Checkbox,
    Tag,
    Affix,
    Menu,
    Dropdown,
    message,
    Form
} from 'antd';
import { EllipsisOutlined } from "@ant-design/icons";
import { firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux';
import {Trans, withTranslation} from "react-i18next";
import { compose } from 'redux'
import moment from "moment";
import {addReview, deleteProduct, getProducts, getTags, isSaved, savePost, unsavePost} from "../../functions/post";
import UIkit from "uikit";
import {loadingView, urlify} from "../../functions/helper";
import {Link} from "react-router-dom";
import {searchPeople} from "../../functions/chat";
const { Panel } = Collapse;
const { Search, TextArea } = Input;


class SearchView extends React.Component {


    state = {
        searchText: null,
        loading: true,
        allLoaded: false,
        currentTag: null,
        tags: [],
        users: [1, 2, 3, 4, 5],
        currentUser: this.props.firebase.auth().currentUser,
    };

    componentDidMount() {
        this.getTags()
    }


    getTags = () => {
        getTags().then(tags => {
            this.setState({
                tags: tags
            })
        });
    }

    getUsers = (startAfter) => {
        searchPeople(startAfter, this.state.searchText).then(users => {
            this.setState({
                users: [...this.state.users, ...users]
            });
        }).catch(err => {
            message.error(err.message);
        })
    }

    search = (value) => {
        this.setState({
            searchText: value,
            users: [],
            loading: true,
        }, () => {
            this.getUsers(null);
        })
    };

    changeTag = e => {
        this.setState({
            currentTag: this.state.currentTag===e.target.id ? null : e.target.id,
            loading: true,
            posts: []
        }, () => {
            this.getPosts(null);
        });
    };


    loadMore = () => {
        const { users } = this.state;
        this.setState({
            loading: true
        }, () => {
            this.getUsers(users[users.length-1].rating);
        });
    }


    render() {
        const { searchText, allLoaded, currentTag, loading, tags, users, currentUser } = this.state;
        const { i18n } = this.props;

        return (
            <div className="uk-container uk-background-muted">
                <div className="uk-background-default">
                    <Row gutter={[8, 8]}>
                        <Col md={6} sm={24} className="uk-background-muted">
                            <div className="posts-tags">
                                <div>
                                    <h4 level={4} className="uk-margin-top uk-text-bold uk-margin-remove-bottom uk-padding-small uk-padding-remove-vertical">
                                        Tags
                                    </h4>
                                    <Collapse bordered={false} ghost={true}>
                                        { tags.filter(tag => tag.parent===null).map(parent => (
                                            <Panel header={
                                                `${parent.value[i18n.language]} • ${tags.filter(tag => tag.parent===parent.id).length}`
                                            } key={parent.id}>
                                                <ul className="uk-list">
                                                    { tags.filter(tag => tag.parent===parent.id).map(tag => (
                                                        <li>
                                                            <Checkbox id={tag.id} checked={currentTag===tag.id} onChange={this.changeTag}>
                                                                { tag.value[i18n.language] }
                                                            </Checkbox>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Panel>
                                        ))}
                                    </Collapse>
                                </div>
                            </div>
                        </Col>
                        <Col md={18} sm={24}>
                            <div className="uk-padding-small posts-border uk-background-default">
                                <Typography.Title level={3} className="section-header uk-text-bold uk-margin-remove">
                                    <Trans>
                                        Users
                                    </Trans>
                                </Typography.Title>
                                <h5 level={5} className="section-meta uk-text-muted uk-margin-remove">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                                </h5>

                                <Affix offsetTop={0}>
                                    <div className="uk-padding-small uk-padding-remove-horizontal uk-background-default">
                                        <Search
                                            placeholder="Search users"
                                            onSearch={this.search}
                                        />


                                        { tags.find(tag => tag.id===currentTag) ?
                                            <div className="uk-margin-small-top">
                                                <Tag.CheckableTag checked={true} onChange={() => this.changeTag({ target: { id: currentTag }})}>
                                                    <h6 className="uk-h5 uk-margin-remove white-color">
                                                        { tags.find(tag => tag.id===currentTag).value[i18n.language] }
                                                    </h6>
                                                </Tag.CheckableTag>
                                            </div>
                                            : null }
                                    </div>
                                </Affix>


                                <div className="posts-list">
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={users}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                    title={
                                                        <a href="https://ant.design">
                                                            Kuna Anarbat • <span className="fas fa-star" /> 4.7
                                                        </a>
                                                    }
                                                    description={
                                                        <div>
                                                            <p className="uk-margin-remove">
                                                                You both interested in Education
                                                            </p>
                                                            <Link to={`s`} key="list-loadmore-edit">
                                                                Message
                                                            </Link>
                                                        </div>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>

                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const enhance = compose(
    firebaseConnect(),
    connect()
)
export default enhance(withTranslation()(SearchView));
