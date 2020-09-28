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
import {createItem, getItem, updateItem} from "../../functions/admin";
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

class NewItem extends React.Component {

    state = {
        files: [],
        images: [],
        loading: false,
        currentUser: this.props.firebase.auth().currentUser,
        item: null
    };

    componentDidMount() {
        if(getQuery(this.props).id){
            this.setState({
                loading: true
            });
            getItem(getQuery(this.props).id).then(item => {
                this.setState({
                    loading: false,
                    item: item
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
            updateItem(post.id, {
                ...values,
                details: values.details ? values.details : null,
                price: values.price ? values.price : null,
                updatedAt: new Date()
            }).then(() => {
                this.setState({
                    loading: false
                }, () => {
                    this.props.history.push("/items");
                });
            }).catch(err => {
                this.setState({
                    loading: false
                }, () => {
                    message.error(err.message);
                });
            });
        } else {
            createItem({
                ...values,
                details: values.details ? values.details : null,
                price: values.price ? values.price : null,
                updatedAt: null,
                createdAt: new Date(),
                urls: []
            }, files).then(() => {
                this.setState({
                    loading: false
                }, () => {
                    this.props.history.push("/items");
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
        const { images, files, loading, item } = this.state;
        const { i18n } = this.props;

        const initialValues = item ? item : {};

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
                                    New item
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
                                    <div className="content-form">
                                        <Form.Item rules={[
                                            {
                                                required: true,
                                                max: 140,
                                                min: 1,
                                                message: "Тақырып ұзындығы 1-140 таңбадан тұруы керек"
                                            },
                                        ]} name={["title", "kz"]} className="title">
                                            <TextArea size="large" placeholder="Атауы" autoSize={{ maxRows: 3}} />
                                        </Form.Item>
                                        <Form.Item name={["details", "kz"]} className="details">
                                            <TextArea placeholder="Егжей-тегжейлері" autoSize={{ minRows: 3}} />
                                        </Form.Item>

                                        <hr/>

                                        <Form.Item rules={[
                                            {
                                                required: true,
                                                max: 140,
                                                min: 1,
                                                message: "Тақырып ұзындығы 1-140 таңбадан тұруы керек"
                                            },
                                        ]} name={["title", "en"]} className="title">
                                            <TextArea size="large" placeholder="Title" autoSize={{ maxRows: 3}} />
                                        </Form.Item>
                                        <Form.Item name={["details", "en"]} className="details">
                                            <TextArea placeholder="Details" autoSize={{ minRows: 3}} />
                                        </Form.Item>

                                        <hr/>

                                        <Form.Item rules={[
                                            {
                                                required: true,
                                                max: 140,
                                                min: 1,
                                                message: "Тақырып ұзындығы 1-140 таңбадан тұруы керек"
                                            },
                                        ]} name={["title", "ru"]} className="title">
                                            <TextArea size="large" placeholder="Название" autoSize={{ maxRows: 3}} />
                                        </Form.Item>
                                        <Form.Item name={["details", "ru"]} className="details">
                                            <TextArea placeholder="Подробности" autoSize={{ minRows: 3}} />
                                        </Form.Item>
                                    </div>

                                </Col>
                                <Col sm={24} md={6}>
                                    <div>
                                        <div>
                                            <Form.Item name="price" label="Қажетті сумма" className="uk-width-1-1 projects-input">
                                                <InputNumber
                                                    min={0} max={100000000} step={1000}
                                                    size="large"
                                                    formatter={value => `₸ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value.replace(/\₸\s?|(,*)/g, '')}
                                                />
                                            </Form.Item>
                                        </div>

                                        <div>
                                            { item ? null :
                                                <Form.Item>
                                                    <div className="uk-width-1-1" uk-form-custom="true">
                                                        <Input multiple onChange={this.onFileSelect} type="file" />
                                                        <button className="uk-button projects-background-color uk-width-1-1" type="button"
                                                                tabIndex="-1">
                                                            <Trans>
                                                                { files.length>0 ? "Өзгерту" : "Таңдау"}
                                                            </Trans>
                                                        </button>
                                                    </div>
                                                </Form.Item>
                                            }
                                        </div>

                                        <Form.List name="sizes" {...layout}>
                                            {(fields, { add, remove }) => {
                                                return (
                                                    <div className="uk-width-1-1 uk-margin-small-top">
                                                        <Form.Item>
                                                            <Row>
                                                                <Col span={12} className="uk-text-middle">
                                                                    Sizes
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
                                                            <Row key={field.key} className="tasks-background">
                                                                <Col span={24}>
                                                                    <Row gutter={8} className="task-item">
                                                                        <Col span={12} className="uk-text-middle uk-text-bolder uk-text-emphasis">
                                                                            Size {field.name+1}
                                                                        </Col>
                                                                        <Col span={12} className="uk-text-right">
                                                                            <Button className="small-delete-button"
                                                                                    onClick={() => {
                                                                                        remove(field.name);
                                                                                    }}>
                                                                                <Trans>
                                                                                    Delete
                                                                                </Trans>
                                                                            </Button>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>

                                                                <Col span={24}>
                                                                    <Form.Item
                                                                        name={field.name}
                                                                        fieldKey={field.fieldKey}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: "Тапсырманы көрсетіңіз"
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Input placeholder="Size..." />
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </div>
                                                );
                                            }}
                                        </Form.List>

                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Form.Item>
                            <Button size="large" type="primary" htmlType="submit" className="news-background-color">
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

export default enhance(withTranslation()(NewItem));
