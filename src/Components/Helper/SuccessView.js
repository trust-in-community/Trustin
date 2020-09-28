import React from "react";
import {Button, Result} from "antd";
import {Trans} from "react-i18next";
import {Link} from "react-router-dom";

const SuccessView = ({ title, subtitle, primaryButton, secondaryButton}) => {

    const firstButton = !primaryButton ? null : (
        <Button type="primary" key="primary" onClick={primaryButton.onClick}>
            <Link to={primaryButton.link}>
                <Trans>
                    { primaryButton.title }
                </Trans>
            </Link>
        </Button>
    )

    const secondButton = !secondaryButton ? null : (
        <Button type="secondary" key="secondary" onClick={secondaryButton.onClick}>
            <Link to={secondaryButton.link}>
                <Trans>
                    { secondaryButton.title }
                </Trans>
            </Link>
        </Button>
    )

    return (
        <div className="uk-margin-large-top uk-margin-large-bottom uk-container">
            <div className="auth uk-background-muted uk-padding-large uk-border-rounded">
                <Result
                    status="success"
                    title={title}
                    subTitle={subtitle}
                    extra={[
                        firstButton,
                        secondButton
                    ]}
                />
            </div>
        </div>
    );
}

export default SuccessView;
