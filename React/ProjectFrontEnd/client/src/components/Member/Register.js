import React, { Component } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import $ from 'jquery';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            full_memId: '',
            full_memNickName: '',
        }
    }

    // 회원가입 버튼 클릭 시 실행되는 함수
    submitClick = async (type, e) => {

        // 각 입력 필드의 값을 변수에 저장
        this.memId_val_checker = $('#memId_val').val();
        this.memId2_val_checker = $('#memId2_val').val();
        this.memPw_val_checker = $('#memPw_val').val();
        this.memPw_cnf_val_checker = $('#memPw_cnf_val').val();
        this.memName_val_checker = $('#memName_val').val();
        this.memNickName_val_checker = $('#memNickName_val').val();

        // 유효성 검사 함수 호출
        this.fnValidate = (e) => {
            var pattern1 = /[0-9]/;
            var pattern2 = /[a-zA-Z]/;
            var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

            if (this.memId_val_checker === '') {
                $('#memId_val').addClass('border_validate_err');
                this.sweetalert('이메일 주소를 다시 확인해주세요.', '', 'error', '닫기')
                return false;
            }
            if (this.memId_val_checker.search(/\s/) !== -1) {
                $('#memId_val').addClass('border_validate_err');
                this.sweetalert('이메일 공백을 제거해 주세요.', '', 'error', '닫기')
                return false;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(this.memId_val_checker)) {
                $('#memId_val').addClass('border_validate_err');
                this.sweetalert('올바른 이메일 형식을 입력해주세요.', '', 'error', '닫기');
                return false;
            }

            $('#memId_val').removeClass('border_validate_err');


            if (this.memPw_val_checker === '') {
                $('#memPw_val').addClass('border_validate_err');
                this.sweetalert('비밀번호를 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            if (this.memPw_val_checker !== '') {
                var str = this.memPw_val_checker;
                if (str.search(/\s/) !== -1) {
                    $('#memPw_val').addClass('border_validate_err');
                    this.sweetalert('비밀번호 공백을 제거해 주세요.', '', 'error', '닫기')
                    return false;
                }
                if (!pattern1.test(str) || !pattern2.test(str) || !pattern3.test(str)
                    || str.length < 8 || str.length > 16) {
                    $('#memPw_val').addClass('border_validate_err');
                    this.sweetalert('8~16자 영문 대 소문자\n숫자, 특수문자를 사용하세요.', '', 'error', '닫기')
                    return false;
                }
            }
            $('#memPw_val').removeClass('border_validate_err');

            if (this.memPw_cnf_val_checker === '') {
                $('#memPw_cnf_val').addClass('border_validate_err');
                this.sweetalert('비밀번호를 한번 더 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            if (this.memPw_val_checker !== this.memPw_cnf_val_checker) {
                $('#memPW_val').addClass('border_validate_err');
                $('#memPw_cnf_val').addClass('border_validate_err');
                this.sweetalert('비밀번호가 일치하지 않습니다.', '', 'error', '닫기')
                return false;
            }
            $('#memPw_cnf_val').removeClass('border_validate_err');

            if (this.memName_val_checker === '') {
                $('#memName_val').addClass('border_validate_err');
                this.sweetalert('이름을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            if (this.memName_val_checker.search(/\s/) !== -1) {
                $('#memName_val').addClass('border_validate_err');
                this.sweetalert('이름에 공백을 제거해 주세요.', '', 'error', '닫기')
                return false;
            }
            $('#memNickName_val').removeClass('border_validate_err');
            if (this.memNickName_val_checker === '') {
                $('#memNickName_val').addClass('border_validate_err');
                this.sweetalert('닉네임을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            if (this.memNickName_val_checker.search(/\s/) !== -1) {
                $('#memNickName_val').addClass('border_validate_err');
                this.sweetalert('닉네임에 공백을 제거해 주세요.', '', 'error', '닫기')
                return false;
            }
            $('#memNickName_val').removeClass('border_validate_err');
            return true;
        }


        // 유효성 검사 통과 시 이메일 중복 확인 및 닉네임 중복 확인
        if (this.fnValidate()) {
            this.state.full_memId = this.memId_val_checker
            axios.post('/api/member/emailCk', {
                memId: this.memId_val_checker

            })
                .then(response => {
                    try {
                        const memIdCk = response.data.memId;

                        if (memIdCk != null) {
                            $('#memId_val').addClass('border_validate_err');
                            this.sweetalert('이미 존재하는 이메일입니다.', '', 'error', '닫기')
                        } else {
                            $('#memId_val').removeClass('border_validate_err');
                            // this.fnSignInsert('signup', e)
                        }
                    } catch (error) {
                        this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                    }
                })
                .catch(response => { return false; });

            this.setState({ full_memNickName: this.memNickName_val_checker });

            axios.post('/api/member/ninameCk', {
                memNickName: this.memNickName_val_checker

            })
                .then(response => {
                    try {
                        const memNickNameCk = response.data.memNickName;

                        if (memNickNameCk != null) {
                            $('#memNickName_val').addClass('border_validate_err');
                            this.sweetalert('이미 존재하는 닉네임입니다.', '', 'error', '닫기')
                        } else {
                            $('#memNickName_val').removeClass('border_validate_err');
                            this.fnSignInsert('signup', e)
                        }
                    } catch (error) {
                        this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                    }
                })
                .catch(response => { return false; });
        }

        this.fnSignInsert = async (type, e) => {
            //form 데이터 Json 형태로 변환
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";

            var Json_data = JSON.parse(Json_form);

            //변환한 데이터 서버에 전송
            axios.post('/api/member/register', Json_data)
                .then(response => {
                    try {
                        if (response.data == "success") {
                            if (type == 'signup') {
                                this.sweetalert('회원가입 되었습니다.', '', 'success', '확인')
                            }
                            setTimeout(function () {
                                this.props.history.push('/login');
                            }.bind(this), 1500
                            );
                        }
                    }
                    catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.')
                    }
                })
                .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
        }
    };

    memIdKeyPress = (e) => {
        $('#memId_val').removeClass('border_validate_err');
    };

    memPwKeyPress = (e) => {
        $('#memPw_val').removeClass('border_validate_err');
    };

    memPwCnfKeyPress = (e) => {
        $('#memPw_cnf_val').removeClass('border_validate_err');
    };

    memNameKeyPress = (e) => {
        $('#memName_val').removeClass('border_validate_err');
    };

    memNickNameKeyPress = (e) => {
        $('#memNickName_val').removeClass('border_validate_err');
    };

    handleSubmit = (e) => {
        e.preventDefault();
    };

    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }


    render() {
        return (
            <div>
                <section className="sub_wrap" >
                    <article className="s_cnt re_1 ct1">
                        <div className="li_top">
                            <h2 className="s_tit1">회원가입</h2>
                            <form method="post" name="frm">
                                <div className="re1_wrap">
                                    <div className="re_cnt ct2">
                                        <table className="table_ty1">
                                            <tr>
                                                <th>이메일</th>
                                                <td>
                                                    <input id="memId_val" type="text" name="memId"
                                                        placeholder="이메일을 입력해주세요." onKeyPress={this.memIdKeyPress}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>비밀번호</th>
                                                <td>
                                                    <input id="memPw_val" type="password" name="memPw"
                                                        placeholder="비밀번호를 입력해주세요." onKeyPress={this.memPwKeyPress} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>비밀번호 확인</th>
                                                <td>
                                                    <input id="memPw_cnf_val" type="password"
                                                        placeholder="비밀번호를 다시 입력해주세요." onKeyPress={this.memPwCnfKeyPress} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>이름</th>
                                                <td>
                                                    <input id="memName_val" type="text" name="memName"
                                                        placeholder="이름을 입력해주세요." onKeyPress={this.memNameKeyPress} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>닉네임</th>
                                                <td>
                                                    <input id="memNickName_val" type="text" name="memNickName"
                                                        placeholder="닉네임을 입력해주세요." onKeyPress={this.memNickNameKeyPress} />
                                                </td>
                                            </tr>

                                        </table>
                                    </div>
                                </div>
                                <div className="btn_confirm">
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                                        onClick={(e) => this.submitClick('signup', e)}>회원가입</a>
                                </div>
                            </form>
                        </div>
                    </article>
                </section>
            </div>
        );
    }
}

export default Register;