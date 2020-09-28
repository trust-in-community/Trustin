import React from "react";
import {convertFromRaw, convertToRaw, Editor, EditorState, RichUtils} from 'draft-js';
import {Button, Divider, message, Typography} from 'antd';
import {getAdmin, updateAdmin} from "../../functions/admin";
import {Trans} from "react-i18next";
import {loadingView} from "../../functions/helper";


class Edit extends React.Component {

    state = {
        admin: {},
        focus: null,
        type: null
    };


    componentDidMount() {
        getAdmin().then(data => {
            this.setState({
                admin: data
            });
        })
    }

    constructor(props) {
        super(props);

        this.focus = (focus) => this.setState({
            focus: focus
        });
        this.onDetailsChange = (editorState, lang = this.state.focus) => this.setState({
            [lang]: editorState
        });
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }

    _handleKeyCommand(command) {
        const editorState = this.state[this.state.focus];
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onDetailsChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const editorState = this.state[this.state.focus];
        const maxDepth = 4;
        this.onDetailsChange(RichUtils.onTab(e, editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        const editorState = this.state[this.state.focus];
        this.onDetailsChange(
            RichUtils.toggleBlockType(
                editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        const editorState = this.state[this.state.focus];
        this.onDetailsChange(
            RichUtils.toggleInlineStyle(
                editorState,
                inlineStyle
            )
        );
    }


    onSave = () => {
        updateAdmin(this.props.type, {
            kz: JSON.stringify(convertToRaw(this.state.kz.getCurrentContent())),
            en: JSON.stringify(convertToRaw(this.state.en.getCurrentContent())),
            ru: JSON.stringify(convertToRaw(this.state.ru.getCurrentContent()))
        }).then(() => {
            message.success(`Successfully updated ${this.props.type}`)
        }).catch(() => {
            message.error(`Failed to update ${this.props.type}`)
        })
    }


    render() {
        const en = this.state["en"];
        const kz = this.state["kz"];
        const ru = this.state["ru"];

        if(this.state.type !== this.props.type){
            const admin = this.state.admin;
            console.log(admin);
            if(admin[this.props.type]){
                const temp = admin[this.props.type];
                this.setState({
                    kz: EditorState.createWithContent(convertFromRaw(JSON.parse(temp.kz))),
                    en: EditorState.createWithContent(convertFromRaw(JSON.parse(temp.en))),
                    ru: EditorState.createWithContent(convertFromRaw(JSON.parse(temp.ru))),
                    type: this.props.type
                });
            } else {
                this.setState({
                    kz: EditorState.createEmpty(),
                    en: EditorState.createEmpty(),
                    ru: EditorState.createEmpty(),
                    type: this.props.type
                })
            }

            return loadingView;
        }

        return (
            <div className="uk-padding">
                <div>
                    <Typography.Title level={4} className="section-header uk-text-bold">
                        <Trans>
                            { this.props.type.toUpperCase() }
                        </Trans>
                    </Typography.Title>
                </div>


                <div>
                    <br />
                    <Divider>
                        <h4 className="uk-margin-remove">
                            { "kz".toUpperCase() }
                        </h4>
                    </Divider>
                    <br />
                    <div className={"custom-form"}>
                        <div className="RichEditor-root">
                            <BlockStyleControls
                                editorState={kz}
                                onToggle={this.toggleBlockType}
                            />
                            <InlineStyleControls
                                editorState={kz}
                                onToggle={this.toggleInlineStyle}
                            />
                            <div className={"RichEditor-editor"} onClick={() => this.focus("kz")}>
                                <Editor
                                    placeholder={`Enter ${this.props.type}`}
                                    blockStyleFn={getBlockStyle}
                                    customStyleMap={styleMap}
                                    editorState={kz}
                                    handleKeyCommand={this.handleKeyCommand}
                                    onChange={(editorState) => this.onDetailsChange(editorState, "kz")}
                                    onTab={this.onTab}
                                    ref="editor"
                                    spellCheck={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <br />
                    <Divider>
                        <h4 className="uk-margin-remove">
                            { "en".toUpperCase() }
                        </h4>
                    </Divider>
                    <br />
                    <div className={"custom-form"}>
                        <div className="RichEditor-root">
                            <BlockStyleControls
                                editorState={en}
                                onToggle={this.toggleBlockType}
                            />
                            <InlineStyleControls
                                editorState={en}
                                onToggle={this.toggleInlineStyle}
                            />
                            <div className={"RichEditor-editor"} onClick={() => this.focus("en")}>
                                <Editor
                                    placeholder={`Enter ${this.props.type}`}
                                    blockStyleFn={getBlockStyle}
                                    customStyleMap={styleMap}
                                    editorState={en}
                                    handleKeyCommand={this.handleKeyCommand}
                                    onChange={(editorState) => this.onDetailsChange(editorState, "en")}
                                    onTab={this.onTab}
                                    ref="editor"
                                    spellCheck={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <br />
                    <Divider>
                        <h4 className="uk-margin-remove">
                            { "ru".toUpperCase() }
                        </h4>
                    </Divider>
                    <br />
                    <div className={"custom-form"}>
                        <div className="RichEditor-root">
                            <BlockStyleControls
                                editorState={ru}
                                onToggle={this.toggleBlockType}
                            />
                            <InlineStyleControls
                                editorState={ru}
                                onToggle={this.toggleInlineStyle}
                            />
                            <div className={"RichEditor-editor"} onClick={() => this.focus("ru")}>
                                <Editor
                                    placeholder={`Enter ${this.props.type}`}
                                    blockStyleFn={getBlockStyle}
                                    customStyleMap={styleMap}
                                    editorState={ru}
                                    handleKeyCommand={this.handleKeyCommand}
                                    onChange={(editorState) => this.onDetailsChange(editorState, "ru")}
                                    onTab={this.onTab}
                                    ref="editor"
                                    spellCheck={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <br />
                <Button onClick={this.onSave} type={"primary"}>
                    Submit
                </Button>

            </div>
        );
    }
}



const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
        editorState: new EditorState.createEmpty()
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span style={{ width: "28px"}} className={className + " uk-text-bold"} onMouseDown={this.onToggle}>
                { this.props.label[0]=='H' ? (<span>H<sub>{this.props.label[1]}</sub></span>): (
                    <span className={this.props.label}  />
                )}
            </span>
        );
    }
}

const BLOCK_TYPES = [
    {label: 'H3', style: 'header-three'},
    {label: 'fas fa-quote-right', style: 'blockquote'},
    {label: 'fas fa-list-ul', style: 'unordered-list-item'},
    {label: 'fas fa-list-ol', style: 'ordered-list-item'}
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <span className="RichEditor-controls">
        {BLOCK_TYPES.map((type) =>
            <StyleButton
                key={type.label}
                active={type.style === blockType}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
            />
        )}
      </span>
    );
};

const INLINE_STYLES = [
    {label: 'fas fa-bold', style: 'BOLD'},
    {label: 'fas fa-italic', style: 'ITALIC'},
    {label: 'fas fa-underline', style: 'UNDERLINE'}
];

const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <span className="RichEditor-controls uk-text-center uk-align-right">
        {INLINE_STYLES.map(type =>
            <StyleButton
                key={type.label}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
            />
        )}
      </span>
    );
};



export default Edit;
