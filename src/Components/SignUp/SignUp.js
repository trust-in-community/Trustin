import React, { useState } from 'react';
import { withTranslation, Trans } from 'react-i18next'
import {
    Form,
    Button,
    Divider,
    Typography, message,
} from 'antd';
import "../User/auth.css"
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import General from "./general";
import Contacts from "./contact";
import Relation from "./relation";
import Offers from "./offers";
import Needs from "./needs";
import {handleFiles} from "../Helper/Handler";
import {signUp} from "../../functions/user";
import {getTags} from "../../functions/post";
import {loadingView} from "../../functions/helper";
const formItemLayout = {
    labelCol: { span : 24 },
    wrapperCol: { span: 24 }
};


class SignUp extends React.Component {

    state = {
        file: null,
        offers: [],
        needs: [],
        profile_url: null,
        loading: false,
        tags: []
    }

    componentDidMount() {
        getTags().then(tags => {
            this.setState({
                tags: tags
            })
        })
    }

    onFinish = values => {
        const { offers, needs, file} = this.state;
        const { t } = this.props;
        window.scrollTo(0, 0);
        if(offers.length < 3){
            message.error(t("Please choose at least 3 offers"));
            return;
        }
        if(needs.length < 3){
            message.error(t("Please choose at least 3 needs"));
            return;
        }
        if(!file){
            message.error(t("Please choose an image"));
            return;
        }

        const user = {
            info: {
                first_name: values.first_name,
                second_name: values.second_name,
                about: values.about,
                avatar: ""
            },
            static: {
                email: values.email,
                year: values.year,
                gender: values.gender,
            },
            contacts: [
                {
                    type: "location",
                    data: values.location
                },
                {
                    type: "phone",
                    data: values.phone
                }
            ],
            relation: {
                type: values.relation,
                details: values.relative_details ? values.relative_details : null,
                name: values.relative_name,
                school: values.relative_school,
                year: values.relative_year,
                phone: values.relative_phone ? values.relative_phone : null
            },
            interests: {
                offers: offers,
                needs: needs
            },
            status: "pending",
            createdAt: new Date()
        }
        this.setState({
            loading: true
        });
        signUp(user, values.password, file).then(() => {
            this.setState({
                loading: false
            }, () => {
                message.success(t("Successfully signed up"));
                this.props.history.push("/");
            });
        }).catch(err => {
            this.setState({
                loading: false
            }, () => {
                message.error(err.message);
            });
        })
    };

    handleFile = (e) => {
        const files = e.target.files;
        handleFiles(files, [], 0, 1, (urls) => {
            this.setState({
                file: files[0],
                profile_url: urls[0]
            })
        });
    }

    handleTag = (item, type) => {
        const { offers, needs } = this.state;

        let nextSelectedTags = type === "offers" ? offers : needs;
        let index = nextSelectedTags.indexOf(item)
        if(index >= 0) {
            nextSelectedTags.splice(index, 1);
        } else {
            nextSelectedTags.push(item);
        }

        if(type === "offers"){
            this.setState({ offers: nextSelectedTags });
        } else {
            this.setState({ needs: nextSelectedTags });
        }
    }


    render() {
        const { offers, needs, profile_url, loading, tags } = this.state;

        return (
            <div className="uk-margin-top uk-margin-large-bottom uk-container uk-container-expand">
                <Typography.Title className="uk-text-center uk-margin-bottom" level={2}>
                    <Trans>
                        Sign Up
                    </Trans>
                </Typography.Title>

                <div className="uk-container">
                    <Form
                        onFinish={this.onFinish}
                        onFinishFailed={() => window.scrollTo(0, 0) }
                        {...formItemLayout}
                        className="auth"
                    >

                        <General file={this.state.file} profile_url={profile_url} handleFile={this.handleFile} />
                        <Divider />
                        <Contacts />
                        <Divider />
                        <Relation/>
                        <Divider />
                        <Offers offers={offers} handleTag={this.handleTag} tags={tags}/>
                        <Divider/>
                        <Needs needs={needs} handleTag={this.handleTag} tags={tags}/>

                        { loading ? loadingView : (
                            <Button size="large" htmlType="submit" type="primary" className="uk-width-1-4@m uk-width-1-1@s">
                                <Trans>
                                    Sign Up
                                </Trans>
                            </Button>
                        )}

                    </Form>

                </div>

            </div>
        );

    }
}

const enhance = compose(
    firestoreConnect(),
    connect()
)
export default enhance(withTranslation()(SignUp));
