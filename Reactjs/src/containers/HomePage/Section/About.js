import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class About extends Component {
    render() {
      
        return (
          <div className="section-share section-about">
            <div className="section-about-header">Truyền thông hỏi về tôi</div>
             <div className="section-about-content">
                 <div className="content-left">
                     <iframe width="60%" height="400px"  src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" 
                     frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullscreen></iframe>
                 </div>
                 <div className="content-right">
                     <p> Trang Web đặt lịch khám bệnh </p>
                 </div>
             </div>
             </div>
        )
    }
}
   



const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
      
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
