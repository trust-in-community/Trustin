import React from "react";
import {
    Form,
    Input,
    Button,
    Typography,
    DatePicker,
    Col,
    Row,
    Select,
    message, Divider
} from 'antd';
import {compose} from "redux";
import { firestoreConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {Trans, withTranslation} from "react-i18next";
import "./events.css"
import { createEvent, updateEvent, getEvent, getTopics } from "../../functions/event";
import moment from "moment";
import "./newEvent.css"
import { loadingView, getQuery } from "../../functions/helper"
const { TextArea } = Input;
const { Option } = Select;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};


class NewEvent extends React.Component {

    state = {
        loading: false,
        event: null,
        topics: []
    };

    componentDidMount() {
        getTopics().then(topics => {
            this.setState({
                topics: topics
            });
        });
        if(getQuery(this.props).id){
            this.setState({
                loading: true
            });
            getEvent(getQuery(this.props).id).then(event => {
                this.setState({
                    loading: false,
                    event: event
                });
            }).catch((err) => {
                this.setState({
                    loading: false
                });
            })
        }
    }

    onFinish = values => {
        const { event } = this.state;

        this.setState({
            loading: true
        });

        if(event){
            updateEvent(event.id, {
                title: values.title,
                location: values.location,
                details: values.details,
                date: new Date(values.date),
                link: values.link ? values.link : null,
                topic: values.topic
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
            createEvent({
                createdAt: new Date(),
                title: values.title,
                location: values.location,
                details: values.details,
                date: new Date(values.date),
                link: values.link ? values.link : null,
                topic: values.topic,
                members: 0,
                urls: [],
                comments: 0
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
        }
    };

    render() {
        const { loading, topics, event } = this.state;
        const { i18n } = this.props;
        const initialValues = event ? {
            ...event,
            "date": moment(new Date(event.date*1000), "YYYY-MM-DD HH:mm")
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
                                { event ? "Edit event" : "New Event" }
                            </Trans>
                        </Typography.Title>
                        <Form className="custom-form card-container" initialValues={initialValues} {...layout} name="nest-messages" onFinish={this.onFinish}>
                            <Row gutter={8}>
                                <Col sm={24} md={4}>
                                    <Form.Item rules={[
                                        {
                                            required: true,
                                            message: "Пожалуйста, укажите дату и время мероприятия"
                                        },
                                    ]} name="date" label="Дата и время события">
                                        <DatePicker locale={"ru"} format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm' }} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col sm={24} md={8}>
                                    <Form.Item rules={[
                                        {
                                            required: true,
                                            message: "Пожалуйста, выберите правильный тег"
                                        },
                                    ]} name="topic" label="Тег поста">
                                        <Select
                                            showSearch
                                            placeholder="Выберите тег"
                                            optionFilterProp="children"
                                            name="topic"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            { topics.map(topic => (
                                                <Option value={topic.id}>{topic[i18n.language]}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col sm={24} md={12}>
                                    <Form.Item name="link" label="Ссылка для регистрации">
                                        <TextArea autoSize />
                                    </Form.Item>
                                </Col>
                            </Row>



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
                                    <TextArea size="large" placeholder="Іс-шараның атауы" autoSize={{ maxRows: 3}} />
                                </Form.Item>
                                <Form.Item rules={[
                                    {
                                        required: true,
                                        message: "Өткізілетін орынды көрсетіңіз"
                                    },
                                ]} name={["location", "kz"]}>
                                    <TextArea autoSize={{ maxRows: 2}} placeholder="Іс-шараның өтетін орны" />
                                </Form.Item>
                                <Form.Item rules={[
                                    {
                                        required: true,
                                        message: "Оқиға туралы ақпаратты енгізіңіз"
                                    },
                                ]} name={["details", "kz"]} className="details">
                                    <TextArea placeholder="Оқиғаның егжей-тегжейлері" autoSize={{ minRows: 3}} />
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
                                        message: "Title must be 1-140 characters length"
                                    },
                                ]} name={["title", "en"]} className="title">
                                    <TextArea size="large" placeholder="Title of the event" autoSize={{ maxRows: 3}} />
                                </Form.Item>
                                <Form.Item rules={[
                                    {
                                        required: true,
                                        message: "Please specify the location of the event"
                                    },
                                ]} name={["location", "en"]}>
                                    <TextArea autoSize={{ maxRows: 2}} placeholder="Location of the event" />
                                </Form.Item>
                                <Form.Item rules={[
                                    {
                                        required: true,
                                        message: "Please enter event details"
                                    },
                                ]} name={["details", "en"]} className="details">
                                    <TextArea placeholder="Details of the event" autoSize={{ minRows: 3}} />
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
                                        message: "Заголовок должен быть длиной от 1 до 140 символов"
                                    },
                                ]} name={["title", "ru"]} className="title">
                                    <TextArea size="large" placeholder="Название мероприятия" autoSize={{ maxRows: 3}} />
                                </Form.Item>
                                <Form.Item rules={[
                                    {
                                        required: true,
                                        message: "Пожалуйста, укажите место проведения мероприятия"
                                    },
                                ]} name={["location", "ru"]}>
                                    <TextArea autoSize={{ maxRows: 2}} placeholder="Место проведения мероприятия" />
                                </Form.Item>
                                <Form.Item rules={[
                                    {
                                        required: true,
                                        message: "Пожалуйста, введите детали события"
                                    },
                                ]} name={["details", "ru"]} className="details">
                                    <TextArea placeholder="Подробности мероприятия" autoSize={{ minRows: 3}} />
                                </Form.Item>
                            </div>


                            <br />
                            <br />
                            <Form.Item>
                                <Button size="large" type="primary" htmlType="submit" className="news-background-color">
                                    { event ? <Trans>Edit</Trans> : <Trans>Submit</Trans> }
                                </Button>
                            </Form.Item>
                        </Form>

                    </div>
                </div>
            </div>
        );
    }
}


const enhance = compose(
    firestoreConnect(),
    connect()
)

export default enhance(withTranslation()(NewEvent));
