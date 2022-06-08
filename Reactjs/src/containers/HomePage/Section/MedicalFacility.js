import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacility.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
class MedicalFacility extends Component {

    render() {
      

        return (
            <div className="section-share section-medical-facility">
            <div className="section-container">
              <div className="section-header">
                <span className="title-section">Cơ sở y tế nổi bật</span>
                <button className="btn-section">Xem thêm</button>
              </div>
              <div class="section-body">
              <Slider {...this.props.settings}>
              <div className="section-customize">
                 <div className="bg-image section-medical-facility"></div>
                 <div>Hệ thống y tế thu cúc</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-medical-facility"></div>
                 <div>Hệ thống y tế thu cúc</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-medical-facility"></div>
                 <div>Hệ thống y tế thu cúc</div>
              </div>
              <div className="section-customize">
              <div className="bg-image section-medical-facility"></div>
                 <div>Hệ thống y tế thu cúc</div>
              </div> 
              <div className="section-customize">
              <div className="bg-image section-medical-facility"></div>
                 <div>Hệ thống y tế thu cúc</div>
                 </div>
              <div className="section-customize">
              <div className="bg-image section-medical-facility"></div>
                 <div>Hệ thống y tế thu cúc</div>
              </div> 
              </Slider>
              </div>
           
            </div>
            
           </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
