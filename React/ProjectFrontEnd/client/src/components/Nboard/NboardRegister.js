import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';

class NboardRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null, // 파일 업로드를 위한 상태 변수
            memNickName: cookie.load('memNickName'), // 쿠키에서 사용자 닉네임을 가져옴
            imageDTOList:[], // 업로드된 이미지 정보를 저장하는 배열
        }
    }

    componentDidMount() {

    }

    // 등록 버튼 클릭 시 실행되는 메서드
    submitClick = async (type, e) => {

        // 입력값 유효성 검사 함수
        this.title_checker = $('#titleVal').val();
        this.content_checker = $('#contentVal').val();

        this.fnValidate = (e) => {
            if (this.title_checker === '') {
                $('#titleVal').addClass('border_validate_err');
                this.sweetalert('제목을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#titleVal').removeClass('border_validate_err');

            if (this.content_checker === '') {
                $('#contentVal').addClass('border_validate_err');
                this.sweetalert('내용을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#contentVal').removeClass('border_validate_err');

            return true;
        }

        // 유효성 검사 후 서버에 데이터 전송
        if (this.fnValidate()) {
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            var Json_data = {
                ...JSON.parse(Json_form),
                imageDTOList: this.state.imageDTOList,
            };
            
            
            axios.post('/api/nBoard/write', Json_data)
            .then(response => {
                try {
                    if (response.data == "succ") {
                            this.sweetalert('등록되었습니다.','','success','확인' )
                            setTimeout(function () {
                                this.props.history.push('/NboardList');
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

    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        })
    }

    sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
        })
    }

    // 파일 선택 input의 값이 변경될 때 실행되는 메서드
    handleFileInput(type, e) {
        if (type == 'file') {
            $('#imagefile').val(e.target.files[0].name)
        } else if (type == 'manual') {
            $('#manualfile').val(e.target.files[0].name)
        }
        this.setState({
            selectedFile: e.target.files[0],
        })
        setTimeout(function () {
            if (type == 'manual') {
                this.handlePostMenual()
            } else {
                this.handlePostImage(type)
            }
        }.bind(this), 1
        );
    }

    // 이미지 파일 업로드 처리 메서드
    handlePostImage(type) {
        const formData = new FormData();
        formData.append('uploadFiles', this.state.selectedFile);
        return axios.post("/uploadAjax", formData).then(res => {
            if (type == 'file') {
                this.setState({ fileName: res.data[0].fileName })
                this.setState({ uuid: res.data[0].uuid })                
                this.setState({ path: res.data[0].folderPath })                
                this.setState({ thumbnailURL: res.data[0].thumbnailURL })                
                this.setState({ imageURL: res.data[0].imageURL })
                
                var str ="";

                str += "<li data-name='" + this.state.fileName + "' data-path='"+this.state.folderPath+"' data-uuid='"+this.state.uuid+"'>";
                str += "<img src='/display?fileName=" + this.state.thumbnailURL + "'>";
                str += "</li>";

                $('#upload_img').append(str)

                const imageInfo = {
                    imgName: this.state.fileName,
                    path: this.state.path,
                    uuid: this.state.uuid,
                    
                };
                this.setState(prevState => ({
                    imageDTOList: [...prevState.imageDTOList, imageInfo], // 이미지 정보를 배열에 추가
                }));

            }
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.')
        })
    }

    handleRemoveAllThumbnails = () => {
        // 모든 썸네일을 제거하고 imageDTOList를 비웁니다.
        $('.fileBox1 ul').empty();
        $('#imagefile').val('');
        this.setState({ imageDTOList: [] });
    };

    render() {
        return (
            <section class="sub_wrap">
                <article class="s_cnt mp_pro_li ct1">
                    <div class="li_top">
                        <h2 class="s_tit1">게 시 글 등 록</h2>
                    </div>
                    <div class="bo_w re1_wrap re1_wrap_writer">
                        <form name="frm" id="frm" action="" onsubmit="" method="post" >
                            <article class="res_w">
                                <div class="tb_outline">
                                    <table class="table_ty1">
                                        <tr>
                                            <th>
                                                <label for="writer">작성자</label>
                                            </th>
                                            <td>
                                                <input type="text" name="writer" id="writerVal" readOnly="readonly" value={this.state.memNickName} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="title">제목</label>
                                            </th>
                                            <td>
                                                <input type="text" name="title" id="titleVal" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="Content">내용</label>
                                            </th>
                                            <td>
                                                <textarea style={{ padding: '15px'}} name="content" id="contentVal" rows="" cols=""></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                파일첨부
                                            </th>
                                            <td className="fileBox fileBox1">
                                                <label htmlFor='imageSelect' className="btn_file">파일선택</label>
                                                <input type="text" id="imagefile" className="fileName fileName1"
                                                    readOnly="readonly" placeholder="선택된 파일 없음" />
                                                <input type="file" id="imageSelect" className="uploadBtn uploadBtn1"
                                                    onChange={e => this.handleFileInput('file', e)} multiple/>
                                                <button type="button" className='bt_ty2' style={{paddingTop:5,paddingLeft:10,paddingRight:10}}
                                                    onClick={this.handleRemoveAllThumbnails}>X</button>
                                                <ul id="upload_img">
                                                </ul>
                                            </td>
                                        </tr>

                                    </table>
                                    <div class="btn_confirm mt20" style={{ "margin-bottom": "44px", textAlign : "center" }}>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass"
                                            onClick={(e) => this.submitClick('file', 
                                            {fileName: this.state.fileName,
                                            folderPath: this.state.folderPath,
                                            uuid: this.state.uuid} , e)}>저장</a>
                                        <Link to={'/NboardList'} className="bt_ty bt_ty2 submit_ty1 saveclass">취소</Link>
                                    </div>
                                </div>
                            </article>
                        </form>
                    </div>
                </article>
            </section>
        );
    }
}

export default NboardRegister;