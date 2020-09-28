import React from "react";
import {
    Form,
    Input,
    Button,
    Typography,
    DatePicker,
    InputNumber,
    Col,
    Row,
    notification,
    Divider, message
} from 'antd';
import {a} from "react-router-dom";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {Trans, withTranslation} from "react-i18next";
import moment from "moment";
import "./project.css"
import "../Events/newEvent.css"
import UIkit from "uikit";
import {handleFiles} from "../Helper/Handler";
import {createProject, getProject, updateProject} from "../../functions/project";
import {getPost, getTopics} from "../../functions/news";
import {getQuery, loadingView} from "../../functions/helper";
const { TextArea } = Input;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};


class NewProject extends React.Component {

    state = {
        files: [],
        images: [],
        loading: false,
        project: null
    };

    componentDidMount() {
        if(getQuery(this.props).id){
            this.setState({
                loading: true
            });
            getProject(getQuery(this.props).id).then(project => {
                this.setState({
                    loading: false,
                    project: project
                });
            }).catch((err) => {
                this.setState({
                    loading: false
                });
            });
        }
    }

    onFinish = values => {
        const { files, project } = this.state;
        if(files.length===0 && !project){
            message.error("Please choose an image");
            return;
        }
        if(!values.tasks || values.tasks.length===0){
            message.error("Please enter minimum one task");
            return;
        }

        console.log(values);
        this.setState({
            loading: true
        })
        if(project) {
            updateProject(project.id, {
                title: values.title,
                details: values.details,
                total: values.total,
                deadline: new Date(values.deadline),
                tasks: values.tasks.map(task => {
                    return { ...task, done: false }
                }),
            }).then(doc => {
                this.setState({
                    loading: false
                }, () => {
                    this.props.history.push("/events");
                });
            }).catch(err => {
                this.setState({
                    loading: false
                }, () => {
                    message.error(err.message);
                });
            });
        } else {
            createProject({
                title: values.title,
                details: values.details,
                total: values.total,
                deadline: new Date(values.deadline),
                tasks: values.tasks.map(task => {
                    return { ...task, done: false }
                }),
                urls: [],
                contributors: 0,
                comments: 0,
                collected: 0,
                createdAt: new Date(),
                faqs: []
            }, files).then(doc => {
                this.setState({
                    loading: false
                }, () => {
                    this.props.history.push("/events");
                });
            }).catch(err => {
                this.setState({
                    loading: false
                }, () => {
                    message.error(err.message);
                });
            });
        }
    };

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
        const { images, files, loading, project } = this.state;
        const { i18n } = this.props;

        const initialValues = project ? {
            "title": project.title,
            "details": project.details,
            "deadline": moment(new Date(project.deadline.seconds*1000), "YYYY-MM-DD"),
            "total": project.total,
            "tasks": project.tasks ? project.tasks : []
        } : {};

        if(loading){
            return loadingView;
        }

        return (
            <div className="uk-padding uk-padding-remove-horizontal uk-background-muted">
                <div id="new_post_result" className="uk-container uk-margin-small-top uk-margin-small-bottom">
                    <div>
                        <Typography.Title level={2} className="section-header uk-text-center uk-text-bold uk-margin">
                            <Trans>
                                { project ? "Edit project" : "New project" }
                            </Trans>
                        </Typography.Title>
                        <Form className="custom-form card-container" initialValues={initialValues} {...layout} name="nest-messages" onFinish={this.onFinish}>
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


                            <Row gutter={[16, 16]}>
                                <Col sm={24} md={16}>
                                    <div>
                                        <br />
                                        <Divider>
                                            <h4 className="uk-margin-remove">
                                                Қазақша
                                            </h4>
                                        </Divider>
                                        <br />

                                        <div className="content-form">
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    max: 140,
                                                    min: 1,
                                                    message: "Тақырып ұзындығы 1-140 таңбадан тұруы керек"
                                                },
                                            ]} name={["title", "kz"]} className="title">
                                                <TextArea size="large" placeholder="Жобаның атауы" autoSize={{ maxRows: 3}} />
                                            </Form.Item>
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Жоба туралы ақпаратты енгізіңіз"
                                                },
                                            ]} name={["details", "kz"]} className="details">
                                                <TextArea placeholder="Жобаның егжей-тегжейлері" autoSize={{ minRows: 3}} />
                                            </Form.Item>
                                        </div>


                                        <br />
                                        <Divider>
                                            <h4 className="uk-margin-remove">
                                                English
                                            </h4>
                                        </Divider>
                                        <br />

                                        <div className="content-form">
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    max: 140,
                                                    min: 1,
                                                    message: "Title must be 1-140 characters long"
                                                },
                                            ]} name={["title", "en"]} className="title">
                                                <TextArea size="large" placeholder="Title of the project" autoSize={{ maxRows: 3}} />
                                            </Form.Item>
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Enter project details"
                                                },
                                            ]} name={["details", "en"]} className="details">
                                                <TextArea placeholder="Project details" autoSize={{ minRows: 3}} />
                                            </Form.Item>
                                        </div>


                                        <br />
                                        <Divider>
                                            <h4 className="uk-margin-remove">
                                                Русский
                                            </h4>
                                        </Divider>
                                        <br />

                                        <div className="content-form">
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    max: 140,
                                                    min: 1,
                                                    message: "Название должно быть длиной от 1 до 140 символов"
                                                },
                                            ]} name={["title", "ru"]} className="title">
                                                <TextArea size="large" placeholder="Название" autoSize={{ maxRows: 3}} />
                                            </Form.Item>
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Введите информацию о проекте"
                                                },
                                            ]} name={["details", "ru"]} className="details">
                                                <TextArea placeholder="Подробности проекта" autoSize={{ minRows: 3}} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={24} md={8}>
                                    <Form.Item rules={[
                                        {
                                            required: true,
                                            message: "Қажетті сумманы көрсетіңіз"
                                        },
                                    ]} name="total" label="Қажетті сумма" className="uk-width-1-1 projects-input">
                                        <InputNumber
                                            min={0} max={100000000} step={1000}
                                            size="large"
                                            formatter={value => `₸ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\₸\s?|(,*)/g, '')}
                                        />
                                    </Form.Item>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item rules={[
                                                {
                                                    required: true,
                                                    message: "Жоба мерзімін көрсетіңіз"
                                                },
                                            ]} name="deadline" label="Жоба мерзімі">
                                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="image"
                                                label="Images"
                                            >
                                                <div className="uk-width-1-1" uk-form-custom="true">
                                                    <Input multiple onChange={this.onFileSelect} type="file" />
                                                    <button className="uk-button projects-background-color white uk-width-1-1 uk-button-small" type="button"
                                                            tabIndex="-1">
                                                        <Trans>
                                                            { files.length>0 ? "Өзгерту" : "Таңдау"}
                                                        </Trans>
                                                    </button>
                                                </div>
                                            </Form.Item>
                                        </Col>
                                    </Row>


                                    <Form.List name="tasks" {...layout}>
                                        {(fields, { add, remove }) => {
                                            return (
                                                <div className="uk-width-1-1 uk-margin-small-top">
                                                    <Form.Item>
                                                        <Row>
                                                            <Col span={12} className="uk-text-middle">
                                                                Тапсырмалар
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
                                                                        ТАПСЫРМА {field.name+1}
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
                                                                    name={[field.name, "kz"]}
                                                                    fieldKey={[field.fieldKey, "kz"]}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: "Тапсырманы көрсетіңіз"
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input placeholder="Тапсырма..." />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={[field.name, "en"]}
                                                                    fieldKey={[field.fieldKey, "en"]}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: "Enter task"
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input placeholder="Task..." />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={[field.name, "ru"]}
                                                                    fieldKey={[field.fieldKey, "ru"]}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: "Укажите задача"
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input placeholder="Задача..." />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </div>
                                            );
                                        }}
                                    </Form.List>
                                </Col>
                            </Row>

                            <br/>
                            <br/>

                            <Form.Item>
                                <Button size="large" type="primary" htmlType="submit" className="projects-background-color">
                                    { project ? <Trans>Edit</Trans> : <Trans>Submit</Trans> }
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {

    let project = null;

    if(state.firebase.data.projects && props.match.params.id){
        const newProject = state.firebase.data.projects[props.match.params.id];
        project = {
            id: props.match.params.id,
            ...newProject
        }
    }

    return {
        auth: state.firebase.auth,
        project: project,
        ...props
    }
}

const enhance = compose(
    firebaseConnect((props) => ([
        { path: "/projects/" + props.match.params.id }
    ])),
    connect(mapStateToProps)
)

export default enhance(withTranslation()(NewProject));
