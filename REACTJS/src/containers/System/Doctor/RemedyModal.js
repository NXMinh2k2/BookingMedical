import React, {Component} from "react"
import { connect } from "react-redux"
import './RemedyModal.scss'
import { FormattedMessage } from "react-intl";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import _ from "lodash"
import * as actions from "../../../store/actions"
import { CommonUtils } from "../../../utils";


class RemedyModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          email: '',
          imageBase64: ''
        }
    }

    componentDidMount() {
        if(this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }   

    componentDidUpdate(prevProps) {
        if(prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    hanleOnchangeEmail = (e) => {
        this.setState({
            email: e.target.value
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

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state)
    }
    
    render() {
        let {isOpenRemedyModal, closeRemedyModal, dataModal,} = this.props
        return (
            <Modal 
                isOpen={isOpenRemedyModal} 
                className={'booking-modal-container'}
                size="lg"
                centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Gửi hóa đơn khám bệnh</h5>
                    <button type="button" className="close" aria-label="Close" onClick={closeRemedyModal}>
                        <span aria-hidden="true">X</span>
                    </button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>Email bệnh nhân</label>
                            <input 
                                className="form-control" 
                                type="email" 
                                value={this.state.email}
                                onChange={(event) => this.hanleOnchangeEmail(event)}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>Chọn file đơn thuốc</label>
                            <input 
                                className="form-control-file" 
                                type="file"
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => this.handleSendRemedy()}>Gửi</Button>
                    <Button >Hủy</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);