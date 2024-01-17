import React, { Component } from 'react';
import $ from 'jquery';

class Footer extends Component {

  componentDidMount() {

    // 홈 화면 또는 로그인 페이지 또는 회원가입 페이지에서는 푸터 숨김
    if (window.location.pathname.endsWith('/')) {
      $('footer').hide()

    }
    if (window.location.pathname.indexOf('/login') != -1) {
      $('footer').hide()
    }

    if (window.location.pathname.indexOf('/Register') != -1) {
      $('footer').hide()
    }

  }

  render() {
    return (
      <footer className="footer">
        <ul>
          <li className="priv"><a href="#n">개인정보처리방침</a></li>
          <li className="em_bt"><a href="#n">이메일주소무단수집거부</a></li>
        </ul>
        <div className="ft_p">
          <span>주소 : 서울시 구로구 항동</span>
          <span>Tel : 02-1234-5678</span>
        </div>
        <p>COPYRIGHT &copy; React 200, ALL RIGHTS RESERVED.{this.props.name}</p>
      </footer>
    );
  }
}

export default Footer;