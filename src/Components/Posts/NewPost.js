import React from "react";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {Trans, withTranslation} from "react-i18next";
import {
    Button,
    Result,
    Typography,
    Row,
    Col,
    Form,
    InputNumber,
    Input,
    Collapse,
    Checkbox,
    Tree,
    notification, Spin, Select, message
} from "antd";
import {handleFiles} from "../Helper/Handler";
import UIkit from "uikit";
import {a} from "react-router-dom";
import moment from "moment";
import {createProduct, getTags, updateProduct, getProduct} from "../../functions/post";
import {getQuery, loadingView} from "../../functions/helper";
const { TextArea } = Input;
const { OptGroup, Option } = Select;
const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

class NewPost extends React.Component {

    state = {
        files: [],
        images: [],
        tags: [],
        loading: false,
        currentUser: this.props.firebase.auth().currentUser,
        post: null
    };

    componentDidMount() {
        getTags().then(tags => {
            this.setState({
                tags: tags
            })
        });
        if(getQuery(this.props).id){
            this.setState({
                loading: true
            });
            getProduct(getQuery(this.props).id).then(post => {
                this.setState({
                    loading: false,
                    post: post
                });
            }).catch((err) => {
                this.setState({
                    loading: false
                });
            })
        }
    }

    onFinish = values => {
        const { post, currentUser, files } = this.state;

        this.setState({
            loading: true
        })

        if(post){
            updateProduct(post.id, {
                ...values,
                details: values.details ? values.details : null,
                price: values.price ? values.price : null,
                updatedAt: new Date()
            }).then(() => {
                this.setState({
                    loading: false
                }, () => {
                    this.props.history.push("/posts");
                });
            }).catch(err => {
                this.setState({
                    loading: false
                }, () => {
                    message.error(err.message);
                });
            });
        } else {
            createProduct({
                ...values,
                details: values.details ? values.details : null,
                price: values.price ? values.price : null,
                updatedAt: null,
                createdAt: new Date(),
                author: {
                    uid: currentUser.uid,
                    name: currentUser.displayName,
                    avatar: currentUser.photoURL
                },
                urls: []
            }, files).then(() => {
                this.setState({
                    loading: false
                }, () => {
                    this.props.history.push("/posts");
                });
            }).catch(err => {
                this.setState({
                    loading: false
                }, () => {
                    message.error(err.message);
                });
            });
        }
    }

    onFileSelect = (e) => {
        const files = e.target.files;
        handleFiles(files, [], 0, 4, (urls) => {
            this.setState({
                files: [...this.state.files, ...files].slice(0, 4),
                images: [...this.state.images, ...urls].slice(0, 4)
            })
        });
    }

    removeFile = (index) => {
        let files = this.state.files;
        let images = this.state.images;
        files.splice(index, 1);
        images.splice(index, 1);
        this.setState({
            files: files,
            images: images
        })
    }


    render() {
        const { tags, images, files, loading, post } = this.state;
        const { i18n, t } = this.props;

        const initialValues = post ? post : {};

        if(loading) {
            return loadingView;
        }

        return (
            <div className="uk-padding uk-padding-remove-horizontal uk-background-muted">
                <Form className="custom-form card-container" initialValues={initialValues} {...layout} name="nest-messages" onFinish={this.onFinish}>
                    <div id="new_post_result" className="uk-container uk-margin-small-top uk-margin-small-bottom">
                        <div>
                            <Typography.Title level={2} className="section-header uk-text-center uk-text-bold uk-margin">
                                <Trans>
                                    New post
                                </Trans>
                            </Typography.Title>
                        </div>

                        <div uk-slider="true">

                            <div className="uk-position-relative uk-visible-toggle uk-light" tabIndex="-1">

                                <ul className="uk-slider-items uk-child-width-1-2 uk-child-width-1-1@s uk-grid">
                                    { images.map(image => (
                                        <li className="uk-text-center uk-background-default uk-border-rounded">
                                            <div className="uk-inline">
                                                <img className="uk-height-large" src={image}  onClick={() =>
                                                    UIkit.lightboxPanel({
                                                        items : images.map(image => {
                                                            return {
                                                                source: image,
                                                                type: "image"
                                                            }
                                                        }),
                                                        index: images.indexOf(image)
                                                    }).show()} />
                                                <div className="uk-position-top-right uk-overlay uk-background-muted" style={{ padding: "4px 8px"}}>
                                                    <a className="uk-text-danger" onClick={() => this.removeFile(images.indexOf(image))}>
                                                        <span className="fas fa-times" />
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <a className="uk-position-center-left uk-position-small uk-hidden-hover"
                                   href="#" uk-slidenav-previous="true" uk-slider-item="previous" />
                                <a className="uk-position-center-right uk-position-small uk-hidden-hover"
                                   href="#" uk-slidenav-next="true" uk-slider-item="next" />

                            </div>

                            <ul className="news-dotnav-color uk-slider-nav uk-dotnav uk-flex-center uk-margin" />

                        </div>

                        <div>
                            <Row gutter={[8, 8]}>
                                <Col sm={24} md={18}>
                                    <div className={"uk-margin-bottom"}>
                                        <Form.Item rules={[{ required: true, message: t("Required field") }]} name="topic" label={t("Choose tag")}>
                                            <Select
                                                showSearch
                                                placeholder={t("Choose tag")}
                                                optionFilterProp="children"
                                                name="topic"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                { tags.filter(tag => tag.parent === null).map(parent => (
                                                    <OptGroup label={parent.value[i18n.language]}>
                                                        { tags.filter(tag => tag.parent === parent.id).map(tag => (
                                                            <Option value={tag.id}>{tag.value[i18n.language]}</Option>
                                                        ))}
                                                    </OptGroup>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className="content-form">
                                        <Form.Item rules={[
                                            {
                                                required: true,
                                                message: t("Required field")
                                            },
                                        ]} name="title" className="title">
                                            <TextArea size="large" placeholder={t("Title")} autoSize={{ maxRows: 3}} />
                                        </Form.Item>
                                        <Form.Item name="details" className="details">
                                            <TextArea placeholder={t("Details")} autoSize={{ minRows: 3}} />
                                        </Form.Item>
                                    </div>

                                </Col>
                                <Col sm={24} md={6}>
                                    <div>
                                        <div>
                                            <Form.Item name="price" label={t("Price")} className="uk-width-1-1 projects-input">
                                                <InputNumber
                                                    min={0} step={1000}
                                                    size="large"
                                                    formatter={value => `₸ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value.replace(/\₸\s?|(,*)/g, '')}
                                                />
                                            </Form.Item>
                                        </div>

                                        <div className={"uk-margin-top"}>
                                            { post ? null :
                                                <Form.Item>
                                                    <div className="uk-width-1-1" uk-form-custom="true">
                                                        <Input multiple onChange={this.onFileSelect} type="file" />
                                                        <Button htmlType={"button"} block type="secondary"
                                                                tabIndex="-1">
                                                            <Trans>
                                                                { files.length>0 ? t("Change") : t("Choose")}
                                                            </Trans>
                                                        </Button>
                                                    </div>
                                                </Form.Item>
                                            }
                                        </div>

                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Form.Item>
                            <Button size="large" type="primary" htmlType="submit">
                                <Trans>
                                    Submit
                                </Trans>
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        );
    }

}

const enhance = compose(
    firebaseConnect(),
    connect()
)

export default enhance(withTranslation()(NewPost));
