import React from "react";
import { Typography } from "antd";
import {Trans} from "react-i18next";

const LoadingView = ({ title, tasks}) => {


    return (
        <div className="uk-margin-large-top uk-margin-large-bottom uk-container">
            <div className="auth uk-background-muted uk-padding-large uk-border-rounded">
                <Typography.Paragraph>
                    <Typography.Text className="feedback">
                        <Trans>
                            { title }
                        </Trans>  <div uk-spinner="true"></div>
                    </Typography.Text>
                </Typography.Paragraph>
                { tasks.map(task => (
                    <Typography.Paragraph className="description">
                        <i className="fas fa-check-circle auth-color" />
                        <Trans>
                            { task }
                        </Trans>
                    </Typography.Paragraph>
                ))}
            </div>
        </div>
    );
}

export default LoadingView;
