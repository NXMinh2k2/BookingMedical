import React, {Component} from "react";
import { connect } from "react-redux";
import './ManageSpecialty.scss'
import { FormattedMessage } from "react-intl";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from "../../../utils";
import { createNewSpecialty } from "../../../services/userService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: ''
        }
    }

    componentDidMount() {
        
    }   

    handleEditorChange = ({ html, text }) => {
        this.setState({ 
            descriptionHTML: html,
            descriptionMarkdown: text
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files
        let file = data[0]
            
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            this.setState({
                imageBase64: base64
            })
        }
    }
    
    handleOnchangeInput = (e, id) => {
        let stateCopy = {...this.state}
        stateCopy[id] = e.target.value
        this.setState({
            ...stateCopy
        })
    
    }

    handleSaveNewSpecialty = async () => {  
        let res = await createNewSpecialty(this.state)
        if(res && res.errCode === 0) {
            toast.success("Tạo chuyên khoa thành công")
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: ''
            })
        } else {
            toast.error("Tọa chuyên khoa thất bại")
        }
    }

    render() {
        return (
            <div className="manage-specialty-container">
                <div className="ms-title">Quản lý chuyên khoa</div>
                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                            <label>Tên chuyên khoa</label>
                            <input 
                                className="form-control" 
                                value={this.state.name}
                                onChange={(e) => this.handleOnchangeInput(e, 'name')}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>Ảnh chuyên khoa</label>
                            <input 
                                className="form-control-file" 
                                type='file'
                                onChange={(e) => this.handleOnChangeImage(e)}
                            />
                        </div>
                        <div className="col-12">
                            <MdEditor 
                                style={{ height: '500px' }} 
                                renderHTML={text => mdParser.render(text)} 
                                onChange={this.handleEditorChange} 
                                value={this.state.contentMarkdown}
                            />
                        </div>
                        <div className="col-12">
                            <button 
                                className="btn-save-specialty"
                                onClick={() => this.handleSaveNewSpecialty()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);