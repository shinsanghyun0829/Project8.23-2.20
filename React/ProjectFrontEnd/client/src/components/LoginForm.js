import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import cookie from 'react-cookies';
import Swal from 'sweetalert2';
import $ from 'jquery';

class LoginForm extends Component {

    // 로그인 버튼 클릭 시 수행되는 함수
    submitClick = (e) => {
        // 입력된 이메일과 비밀번호 값 가져오기
        this.memId_val = $('#memId_val').val();
        this.memPw_val = $('#memPw_val').val();

        // 이메일과 비밀번호가 빈 값인지 확인
        if (this.memId_val === '' || this.memPw_val === '') {
            this.sweetalert('이메일과 비밀번호를 입력해주세요.', '', 'error', '닫기')
        } else {
            // 서버에 로그인 정보 전송
            axios.post('/api/member/loginPost', {
                memId: this.memId_val,
                memPw: this.memPw_val
            })
                .then(response => {
                    var memId = response.data.memId
                    var memNickName = response.data.memNickName
                    var memPw = response.data.memPw

                    // 로그인 성공 시 쿠키에 저장하고 MainForm으로 이동
                    if (response.data.memId != undefined) {
                        const expires = new Date()
                        expires.setMinutes(expires.getMinutes() + 60)
                        cookie.save('memId', memId
                            , { path: '/', expires })
                        cookie.save('memNickName', memNickName
                            , { path: '/', expires })
                        cookie.save('memPw', memPw
                            , { path: '/', expires })

                        window.location.href = '/MainForm';

                    } else {
                        this.sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'error', '닫기')
                    }
                })
                .catch(error => { this.sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'error', '닫기') });
        }
    }

    // SweetAlert 팝업을 띄우기 위한 함수
    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }

    // Enter 키 입력 시 submitClick 함수 실행
    handleOnKeyPress = e => {
        if (e.key === 'Enter') {
            this.submitClick(); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };

    render() {
        return (
            <section className="main">

                <div className="m_login signin">
                    <span className="logo-image">
                        <img
                            src={require("../img/layout/어디야로고.png")}
                            style={{ width: '350px', height: 'auto', marginBottom: '0px' }}
                        />

                    </span>
                    {/* <span><img src={require("../img/layout/carlogo001.png")}></img></span> */}
                    <h3>LOGIN</h3>
                    <div className="log_box">
                        <div className="in_ty1">
                            <span><img src={require("../img/main/m_log_i3.png")} alt="" /></span>
                            <input type="email" id="memId_val" placeholder="이메일" />
                        </div>
                        <div className="in_ty1">
                            <span className="ic_2">
                                <img src={require("../img/main/m_log_i2.png")} alt="" />
                            </span>
                            <input type="password" id="memPw_val" placeholder="비밀번호" onKeyPress={this.handleOnKeyPress} />
                        </div>

                        <br></br>
                        <Link>
                            <div className="s_bt" type="button" onClick={(e) => this.submitClick(e)} >로그인</div>
                        </Link>
                        <br></br>
                        <Link to={"/Register"}>
                            <div className="s_bt" type="button">회원가입</div>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }
}

export default LoginForm;