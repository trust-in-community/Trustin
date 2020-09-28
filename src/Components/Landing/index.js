import React from 'react';
import Welcome from "./Welcome";
import Projects from "./Projects";
import News from "./News";

class Landing extends React.Component {

    render() {
        return (
            <div>
                <Welcome />
                {/*<Projects />*/}
                {/*<News />*/}
                {/*<Events />*/}
            </div>
        );
    }

}

export default Landing;
