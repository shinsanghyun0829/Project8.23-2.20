import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery';
import cookie from 'react-cookies';

class Modify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //state 초기화
            selectedFile: null,
            memId: '',
            memName: '',
            memNickName: '',
            memNo: '',
            memPw: '',
            full_memNickName: '',
        }
    }
    componentDidMount = async () => {

        // 쿠키에서 사용자 정보를 로드하고 상태를 설정합니다.
        var cookie_memNickName = await cookie.load('memNickName')
        var cookie_memId = await cookie.load('memId')
        var cookie_memPw = await cookie.load('memPw')
        this.setState({ memNickname: cookie_memNickName })
        this.setState({ memId: cookie_memId })
        this.setState({ memPw: cookie_memPw })


        this.callModifyInfoApi()
    }

    // 수정을 위해 사용자 정보를 가져오기 위한 API 호출
    callModifyInfoApi = async () => {


        axios.post('/api/member/readMember', {
            memId: this.state.memId,
        })
            .then(response => {
                try {
                    var data = response.data
                    // 사용자 정보로 상태 설정
                    this.setState({ memNickName: data.memNickName })
                    this.setState({ memName: data.memName })
                    this.setState({ memNo: data.memNo })
                    $('#is_memNickName').val(data.memNickName)
                }
                catch (error) {
                    alert('1. 작업중 오류가 발생하였습니다.')
                }
            })
            .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });
    }

    // 수정 버튼 클릭 시 호출되는 함수
    submitClick = async (type, e) => {
        this.memPw_val_checker = $('#memPw_val').val();
        this.memPw_cnf_val_checker = $('#memPw_cnf_val').val();
        this.memNickName_val_checker = $('#memNickName_val').val();

        //유효성 검사
        this.fnValidate = (e) => {
            var pattern1 = /[0-9]/;
            var pattern2 = /[a-zA-Z]/;
            var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

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
                this.sweetalert('비밀번호 확인을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            if (this.memPw_val_checker !== this.memPw_cnf_val_checker) {
                $('#memPw_val').addClass('border_validate_err');
                $('#memPw_cnf_val').addClass('border_validate_err');
                this.sweetalert('비밀번호가 일치하지 않습니다.', '', 'error', '닫기')
                return false;
            }
            $('#memPw_cnf_val').removeClass('border_validate_err');
            return true;
        }

        if (this.fnValidate()) {
            this.setState({ full_memNickName: this.memNickName_val_checker })
            //this.state.full_memNickName = this.memNickName_val_checker
            this.state.memNickName = this.memNickName_val_checker
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
                            this.fnSignInsert('modify', e)
                        }
                    } catch (error) {
                        this.sweetalert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
                    }
                })
                .catch(response => { return false; });
        }

        // 유효성검사 완료 후 회원 정보 수정 함수
        this.fnSignInsert = async (type, e) => {
            // 폼 데이터를 JSON 형태로 변환
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";

            var Json_data = JSON.parse(Json_form);

            // 회원 정보 수정 API 호출
            await axios.post('/api/member/modifyMember', Json_data)
                .then(response => {
                    try {
                        if (response.data == "SUCCESS") {
                            if (type == 'modify') {
                                this.sweetalertModify('수정되었습니다. \n 다시 로그인해주세요.', '', 'success', '확인')
                            }

                        }
                    }
                    catch (error) {
                        alert('1. 작업중 오류가 발생하였습니다.')
                    }
                })
                .catch(error => { alert('2. 작업중 오류가 발생하였습니다.'); return false; });

        }
    };

    memPwKeyPress = (e) => {
        $('#memPw_val').removeClass('border_validate_err');
    };

    memPwCnfKeyPress = (e) => {
        $('#memPw_cnf_val').removeClass('border_validate_err');
    };

    memNickNameKeyPress = (e) => {
        $('#memNickName_val').removeClass('border_validate_err');
    };

    handleSubmit = (e) => {
        e.preventDefault();
    };

    mustNumber = (id) => {
        var pattern1 = /[0-9]/;
        var str = $('#' + id).val();
        if (!pattern1.test(str.substr(str.length - 1, 1))) {
            $('#' + id).val(str.substr(0, str.length - 1));
        }
    }

    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }

     // 회원 정보 수정 성공 시 SweetAlert로 메시지를 보여주고 로그아웃 후 페이지 이동
    sweetalertModify = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        }).then(function () {
            cookie.remove('memId', { path: '/' });
            cookie.remove('memNickName', { path: '/' });
            cookie.remove('memPw', { path: '/' });
            window.location.href = '/';
        })
    }

    // 회원 탈퇴 버튼 클릭 시 호출되는 함수
    deleteMember = (e) => {
        var event_target = e.target
        this.sweetalertDelete('정말 탈퇴하시겠습니까?', function () {
            axios.post('/api/member/deleteMember', {
                memId: this.state.memId
            })
                .then(response => {
                }).catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
        }.bind(this))
    }

    //회원탈퇴 완료 시 로그인폼으로 이동
    sweetalertDelete = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    '탈퇴되었습니다.',
                    '',
                    'success'
                )
                cookie.remove('memId', { path: '/' });
                cookie.remove('memNickName', { path: '/' });
                cookie.remove('memPw', { path: '/' });
                window.location.href = '/MainForm';
            } else {
                return false;
            }
            callbackFunc()
        })
    }

    render() {
        return (
            <div>
                <section className="sub_wrap" >
                    <article className="s_cnt re_1 ct1">
                        <div className="li_top">
                            <h2 className="s_tit1">회원정보수정</h2>
                            <form method="post" name="frm">
                                <div className="re1_wrap">
                                    <div className="re_cnt ct2">
                                        <table className="table_ty1">
                                            <tr className="re_email">
                                                <th>이메일</th>
                                                <td>
                                                    <input name="memId" id="memId_val" readOnly="readonly" value={this.state.memId} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>이름</th>
                                                <td>
                                                    <input name="memName" id="memName_val" readOnly="readonly" value={this.state.memName} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>닉네임</th>
                                                <td>
                                                    <input id="memNickName_val" type="text" name="memNickName" placeholder="닉네임을 입력해주세요."
                                                        onKeyPress={this.memNickNameKeyPress} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>새 비밀번호</th>
                                                <td>
                                                    <input id="memPw_val" type="password" name="memPw"
                                                        placeholder="비밀번호를 입력해주세요." onKeyPress={this.memPwKeyPress} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>비밀번호 확인</th>
                                                <td>
                                                    <input id="memPw_cnf_val" type="password"
                                                        placeholder="비밀번호를 한번 더 입력해주세요." onKeyPress={this.memPwCnfKeyPress} />
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="btn_confirm">
                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass"
                                        onClick={(e) => this.submitClick('modify', e)}>수정</a>

                                    <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 deleteclass" id={this.state.email}
                                        onClick={(e) => this.deleteMember('delete', e)}>탈퇴</a>
                                </div>
                            </form>
                        </div>
                    </article>
                </section>
            </div>
        );
    }
}

export default Modify;