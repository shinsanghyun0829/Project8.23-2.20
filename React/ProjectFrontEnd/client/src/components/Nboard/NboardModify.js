import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';

class NboardModify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bno: props.match.params.bno,
            selectedFile: null,
            imageDTOList: [],
            imageList: [],
            title: '',
            content: '',
            writer: '',
        }
    }

    componentDidMount() {
        this.callNboardInfoApi();
        $('#articleNo').hide();
    }

    // 게시글 정보를 서버에서 불러와 상태를 업데이트하는 함수
    callNboardInfoApi = async () => {


        axios.post('/api/nBoard/read', {
            bNo: this.state.bno,
        })
            .then(response => {
                try {
                    var data = response.data
                    this.setState({
                        title: data.title,
                        content: data.content,
                        writer: data.writer,
                        imageDTOList: data.imageDTOList,
                        imageList: data.imageDTOList.map(image => ({
                            thumbnailURL: image.thumbnailURL,
                        })),
                    });
                }
                catch (error) {
                    alert('게시글데이터 받기 오류')
                }
            })
            .catch(error => { alert('게시글데이터 받기 오류2'); return false; });

    }

    // 이미지 목록을 렌더링하는 함수
    renderImages = () => {
        const { imageList } = this.state;

        return imageList.map((image, index) => (
            <li className="hidden_type" key={index}>
                <img
                    src={`/display?fileName=${image.thumbnailURL}`}
                    alt={`썸네일 ${index}`}
                />
            </li>
        ));
    };

    // 수정 버튼 클릭 시 실행되는 함수
    submitClick = async (type, e) => {

        // 유효성 검사
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

        // 유효성 검사 통과 시 서버에 수정 요청
        if (this.fnValidate()) {
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            var Json_data = {
                ...JSON.parse(Json_form),
                imageDTOList: this.state.imageDTOList,
            };



            axios.post('/api/nBoard/modify', Json_data)
                .then(response => {
                    try {
                        if (response.data == "succ") {
                            this.sweetalert('수정되었습니다.', '', 'success', '확인')
                            setTimeout(function () {
                                this.props.history.push(`/NboardRead/${this.state.bno}`);
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

    // 파일 선택 시 실행되는 함수
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

    // 이미지 업로드를 처리하는 함수
    handlePostImage(type) {
        const formData = new FormData();
        formData.append('uploadFiles', this.state.selectedFile);
        return axios.post("/uploadAjax", formData).then(res => {
            if (type == 'file') {
                // 이미지 정보를 상태에 업데이트
                this.setState({ fileName: res.data[0].fileName })
                this.setState({ uuid: res.data[0].uuid })
                this.setState({ path: res.data[0].folderPath })
                this.setState({ thumbnailURL: res.data[0].thumbnailURL })
                this.setState({ imageURL: res.data[0].imageURL })

                var str = "";

                str += "<li data-name='" + this.state.fileName + "' data-path='" + this.state.folderPath + "' data-uuid='" + this.state.uuid + "'>";
                str += "<img src='/display?fileName=" + this.state.thumbnailURL + "'>";
                str += "</li>";

                $('#upload_img').append(str)

                // 업로드된 이미지 정보를 배열에 추가
                const imageInfo = {
                    imgName: this.state.fileName,
                    path: this.state.path,
                    uuid: this.state.uuid,
                };
                this.setState(prevState => ({
                    imageDTOList: [...prevState.imageDTOList, imageInfo], 
                }));

            }
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.')
        })
    }

    // 모든 썸네일을 제거하고 imageDTOList를 비우는 함수
    handleRemoveAllThumbnails = () => {
        $('.fileBox1 ul').empty();
        $('#imagefile').val('');
        this.setState({ imageDTOList: [] });
    };

    render() {
        return (
            <section class="sub_wrap">
                <article class="s_cnt mp_pro_li ct1">
                    <div class="li_top">
                        <h2 class="s_tit1">게 시 글 수 정</h2>
                    </div>
                    <div class="bo_w re1_wrap re1_wrap_writer">
                        <form name="frm" id="frm" action="" onsubmit="" method="post" >
                            <article class="res_w">
                                <div class="tb_outline">
                                    <table class="table_ty1">
                                        <tr id="articleNo">
                                            <th>
                                                <label for="bNo">글번호</label>
                                            </th>
                                            <td>
                                                <input type="text" name="bNo" id="bNoVal" value={this.state.bno} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="title">제목</label>
                                            </th>
                                            <td>
                                                <input type="text" name="title" id="titleVal" defaultValue={this.state.title} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="Content">내용</label>
                                            </th>
                                            <td>
                                                <textarea style={{ padding: '15px' }} name="content" id="contentVal" rows="" cols="" defaultValue={this.state.content} ></textarea>
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
                                                    onChange={e => this.handleFileInput('file', e)} multiple />
                                                <button type="button" className='bt_ty2' style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}
                                                    onClick={this.handleRemoveAllThumbnails}>X</button>
                                                <ul id="upload_img">
                                                    {this.renderImages()}
                                                </ul>
                                            </td>
                                        </tr>

                                    </table>
                                    <div class="btn_confirm mt20" style={{ "margin-bottom": "44px", textAlign: "center" }}>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass"
                                            onClick={(e) => this.submitClick('file',
                                                {
                                                    fileName: this.state.fileName,
                                                    folderPath: this.state.folderPath,
                                                    uuid: this.state.uuid
                                                }, e)}>저장</a>
                                        <Link to={`/NboardRead/${this.state.bno}`} className="bt_ty bt_ty2 submit_ty1 saveclass">취소</Link>
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

export default NboardModify;