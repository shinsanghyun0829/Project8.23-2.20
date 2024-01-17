import React, { Component } from 'react';
import { Route } from "react-router-dom";
import cookie from 'react-cookies';
import axios from "axios";
import $ from 'jquery';

// CSS 파일 import
import '../css/new.css';

// 헤더 컴포넌트 import
import Header from './Header/Header';

// 메인 컴포넌트 import
import MainForm from './Main/MainForm';

// 푸터 컴포넌트 import
import Footer from './Footer/Footer';

// 로그인 컴포넌트 import
import LoginForm from './LoginForm';

// 회원 관리 컴포넌트 import
import CarRegister from './Member/CarRegister';
import Register from './Member/Register';
import Modify from './Member/Modify';
import MyPage from './Member/MyPage';

// 충전소 찾기 컴포넌트 import
import FindStation from './FindStation/App';

// 게시판 컴포넌트 import
import NboardList from './Nboard/NboardList';
import NboardRegister from './Nboard/NboardRegister';
import NboardRead from './Nboard/NboardRead';
import NboardModify from './Nboard/NboardModify';



class App extends Component {
  constructor(props) {
    super(props);
    // State 초기화
    this.state = {
      memId: '',
      memPw: '',
    }
  }

  componentDidMount() {

    // 특정 경로에 접근 시 로그인 쿠키 확인
    if (window.location.pathname.includes('/MainForm')
      || window.location.pathname.includes('/MyPage')
      || window.location.pathname.includes('/MyPage')
      || window.location.pathname.includes('/Modify/')
      || window.location.pathname.includes('/CarRegister')
      || window.location.pathname.includes('/findStation')
      || window.location.pathname.includes('/NboardList')
      || window.location.pathname.includes('/NboardRegister')
      || window.location.pathname.includes('/NboardRead')
      || window.location.pathname.includes('/NboardModify')) {

      axios.post('/api/member/loginCookie', {
        memId: cookie.load('memId'),
        memPw: cookie.load('memPw')
      }).then(response => {
        if (response.data.memId == undefined) {
          this.noPermission();
        } else {

        }
      }).catch(error => {
        this.noPermission();
      })
    }
  }

  // 권한 없음 시 처리 함수
  noPermission = (e) => {
    if (window.location.hash != 'nocookie') {
      this.remove_cookie();
      window.location.href = '/login/#nocookie';
    }
  };

  // 쿠키 삭제 함수
  remove_cookie = (e) => {
    cookie.remove('memId', { path: '/' });
    cookie.remove('memNickName', { path: '/' });
    cookie.remove('memPw', { path: '/' });
  }

  render() {
    return (

      <div className="App">

        <Header />
        <Route exact path='/' component={LoginForm} />
        <Route path='/login' component={LoginForm} />
        <Route path='/MainForm' component={MainForm} />
        <Route path='/Register' component={Register} />
        <Route path='/MyPage' component={MyPage} />
        <Route path='/Modify/' component={Modify} />
        <Route path='/CarRegister' component={CarRegister} />

        <Route path='/FindStation' component={FindStation} />

        <Route path='/NboardList' component={NboardList} />
        <Route path='/NboardRegister' component={NboardRegister} />
        <Route path='/NboardRead/:bno' component={NboardRead} />
        <Route path='/NboardModify/:bno' component={NboardModify} />

        <Footer />

      </div>

    );

  };
}

export default App;


