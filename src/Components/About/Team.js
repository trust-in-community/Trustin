import React, { Component } from 'react';
import { withTranslation, Trans } from 'react-i18next'
import {Avatar, List, Typography} from "antd";
import {getAdmin} from "../../functions/admin";



class Team extends Component {

    state = {
        team: []
    }

    componentDidMount() {
        getAdmin().then(data => {
            this.setState({
                team: data.team&&data.team.members ? data.team.members : [],
            })
        })
    }

    render(){
        const { i18n, t } = this.props;
        const { team } = this.state;

        //RETURN
        return (
            <div className="uk-container uk-margin-top">
                <Typography.Title level={2} className="section-header uk-text-center uk-text-bold uk-margin-remove">
                    <Trans>
                        Team
                    </Trans>
                </Typography.Title>


                <List
                    itemLayout="horizontal"
                    dataSource={team}
                    renderItem={member => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={member.image} />}
                                title={<a>{member.name[i18n.language]}</a>}
                                description={`${ member.role[i18n.language] } • ${ member.year }`}
                            />
                        </List.Item>
                    )}
                />

            </div>
        );


    }
}


export default withTranslation()(Team);
