import React from "react";

class NotFound extends React.Component {

    render() {

        return (
            <div className={"uk-text-center uk-padding-large"}>
                <img src={require("./404.svg")} className={"uk-width-xlarge"} />
            </div>
        )
    }
}

export default NotFound;