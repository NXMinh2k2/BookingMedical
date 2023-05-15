import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import "./ManageSchedule.scss";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { dateFormat, languages } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDoctors: [],
      selectedDoctor: "",
      currentDate: "",
      rangeTime: []
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.fetchAllScheduleTime()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        allDoctors: dataSelect,
      });
    }

    if(prevProps.allScheduleTime != this.props.allScheduleTime) {
      let allScheduleTime = this.props.allScheduleTime
      if(allScheduleTime && allScheduleTime.length > 0) {
          allScheduleTime = allScheduleTime.map(item=> ({...item, isSelected: false}))   
      }
      this.setState({
        rangeTime: allScheduleTime
      })
    }

    // if(prevProps.language !== this.props.language) {
    //     let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
    //     this.setState({
    //         allDoctors: dataSelect
    //     })
    // }
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;
        object.label = language === languages.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  handleChangeSelect = (selectedDoctor) => {
    this.setState({ selectedDoctor });
  };

  handleChangeDatePicker = (date) => {
    this.setState({
        currentDate: date[0]
    })
  };

  handleClickBtnTime = (time) => {
    let {rangeTime} = this.state
    if(rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map(item => {
        if(item.id === time.id) item.isSelected = !item.isSelected
        return item
      })
    }
    this.setState({
      rangeTime: rangeTime
    })
  }

  handleSaveSchedule = async () => {
    let {rangeTime, selectedDoctor, currentDate} = this.state
    let result = []
    if(!currentDate) {
      toast.error("Invalid Select")
      return
    }
    if(selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("Invalid selected doctor")
      return
    }
    let formattedDate = new Date(currentDate).getTime();
    if(rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter(item => item.isSelected === true)
      if(selectedTime && selectedTime.length > 0) {
        selectedTime.map(item => {
          let obj = {}
          obj.doctorId = selectedDoctor.value
          obj.date = formattedDate
          obj.timeTypes = item.keyMap
          result.push(obj)
        })
      } else {
        toast.error("Invalid selected time!")
        return
      } 
    }
    
    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      date: formattedDate
    })
    if(res && res.errCode === 0) {
      toast.success("Save info succeed!")
    } else {
      toast.error("Error saveBulkScheduleDoctor!")
    }
  }


  render() {
    const { selectedDoctor, currentDate, rangeTime } = this.state;
    let {language} = this.props
    let yesterday = new Date(new Date().setDate(new Date(). getDate() - 1))

    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
              <Select     
                value={selectedDoctor}
                onChange={this.handleChangeSelect}
                options={this.state.allDoctors}
              />
            </div>
            <div className="col-6 form-group">
              <label><FormattedMessage id="manage-schedule.choose-date" /></label>
              <DatePicker
                onChange={this.handleChangeDatePicker}
                className="form-control"
                minDate={yesterday}
                value={currentDate}
              />
            </div>
            <div className="col-12 pick-hour-container">
                {rangeTime && rangeTime.length > 0 &&
                 rangeTime.map((item, index) => {
                    return (
                      <button 
                        className={item.isSelected === true ? "btn active" : "btn"}
                        key={index}
                        onClick={() => this.handleClickBtnTime(item)}
                      >
                        {language === languages.VI ? item.valueVi : item.valueEn}
                      </button>
                    )
                 })
                }
            </div>
            <div className="col-12">
              <button 
                className="btn btn-primary btn-save-schedule"
                onClick={() => this. handleSaveSchedule()}
              >
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
