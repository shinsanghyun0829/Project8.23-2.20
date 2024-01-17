import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';
import Modal from 'react-modal';

class NboardRead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 상태 변수 초기화
            bno: props.match.params.bno, // URL에서 게시글 번호를 가져옴
            selectedFile: null,
            memNickName: cookie.load('memNickName'), // 쿠키에서 회원 닉네임을 가져옴
            thumbnailURL: '',
            title: '',
            content: '',
            writer: '',
            viewCnt: '',
            regidate: '',
            imageDTOList: [],
            modalIsOpen: false,
            selectedImage: '',
            imageList: [],
            replyer: '',
            replyText: '',
            reply_checker: '',
            isEditModalOpen: false,
            editedContent: '',
            selectRno: ''
        }
    }

    componentDidMount() {
        this.callNboardInfoApi();
        this.callReplyListApi(this.state.bno);
        $("#modifyButton").hide();
        $("#replyerDiv").hide();
        $("#bNoDiv").hide();
    }

    // Nboard 정보를 가져오는 API 호출
    callNboardInfoApi = async () => {


        axios.post('/api/nBoard/read', {
            bNo: this.state.bno,
        })
            .then(response => {
                try {
                    var data = response.data
                    this.setState({ imageList: data.imageDTOList });
                    this.setState({ title: data.title })
                    this.setState({ content: data.content })
                    this.setState({ writer: data.writer })
                    this.setState({ viewCnt: data.viewCnt })
                    this.setState({ regidate: data.regidate })
                    this.setState({ imageDTOList: data.imageDTOList })
                    if (this.state.memNickName == this.state.writer) {
                        $("#modifyButton").show();
                    }
                }
                catch (error) {
                    alert('게시글데이터 받기 오류')
                }
            })
            .catch(error => { alert('게시글데이터 받기 오류2'); return false; });

    }

    // 썸네일 클릭 시 모달 열기
    handleThumbnailClick = (thumbnailURL) => {
        this.setState({ modalIsOpen: true, selectedImage: thumbnailURL });
    };

    // 이미지 모달 닫기
    closeImageModal = () => {
        this.setState({ modalIsOpen: false, selectedImage: '' });
    };

    // 이미지 목록 렌더링
    renderImages = () => {
        const { imageList } = this.state;

        return imageList.map((image, index) => (
            <li className="hidden_type" key={index}>
                <img
                    src={`/display?fileName=${image.thumbnailURL}`}
                    alt={`썸네일 ${index}`}
                    onClick={() => this.handleThumbnailClick(image.imageURL)}
                />
            </li>
        ));
    };


    //게시물 삭제 함수
    deleteArticle = (e) => {

        this.sweetalertDelete1('삭제하시겠습니까?', function () {
            axios.post('/api/nBoard/delete', {
                bNo: this.state.bno
            })
                .then(response => {
                }).catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
        }.bind(this))
    }

    sweetalertDelete1 = (title, callbackFunc) => {
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
                    '삭제되었습니다.',
                    '',
                    'success'
                ).then(() => {
                    window.location.href = '/NboardList';
                });
            } else {
                return false;
            }
            callbackFunc()
        })
    }

    //댓글작성 함수
    submitClick = async (e) => {

        this.reply_checker = $('#replyTextVal').val();

        this.fnValidate = (e) => {
            if (this.reply_checker === '') {
                $('#replyTextVal').addClass('border_validate_err');
                this.sweetalert('댓글내용을 입력해주세요.', '', 'error', '닫기')
                return false;
            }
            $('#replyTextVal').removeClass('border_validate_err');
            return true;
        }

        if (this.fnValidate()) {
            var jsonstr = $("form[name='frm2']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";
            var Json_data = JSON.parse(Json_form);

            //댓글내용을 Json데이터로 변환해 서버에 전송
            axios.post('/api/nreply/add', Json_data)
                .then(response => {
                    try {
                        if (response.data == "SUCCESS") {
                            setTimeout(function () {
                                this.callReplyListApi(this.state.bno);
                                $('#replyTextVal').val('')
                            }.bind(this), 1000
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

    // 댓글 목록을 가져오는 API 호출
    callReplyListApi = async (bno) => {
        axios.get(`/api/nreply/list/${bno}`)
            .then(response => {
                try {
                    this.setState({ responseReplyList: response });
                    this.setState({ append_ReplyList: this.ReplyListAppend() });
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다1.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
    }

    // 댓글 목록을 렌더링
    ReplyListAppend = () => {
        let result = []
        var ReplyList = this.state.responseReplyList.data


        const currentUser = this.state.memNickName;

        for (let i = 0; i < ReplyList.length; i++) {
            var data = ReplyList[i]
            const isCurrentUserCommentOwner = data.replyer === currentUser;
            const formattedDate = new Date(data.regdate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).split('.').join('/').replace(/\s/g, '');

            const trimmedDate = formattedDate.slice(0, -1);

            result.push(
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '19px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '80px' }}>
                            <img src={require(`../../img/댓글2.gif`)} alt="댓글 이미지" />
                        </div>
                        <div className="cat">
                            <p style={{ fontSize: '19px' }}>{data.replyer}   <span style={{ fontSize: '12px' }}>{trimmedDate}</span></p>
                            <p style={{ color: '#525252' }}>{data.replyText}</p>
                        </div>
                    </div>
                    <div>
                        {isCurrentUserCommentOwner && (
                            <div>
                                <button className="catbtn bt_ty2 submit_ty1 saveclass" onClick={() => this.openEditModal(i)}>수정</button>
                                <button className="catbtn bt_ty2 submit_ty1 saveclass" onClick={() => this.deleteComment(i)}>삭제</button>
                            </div>
                        )}
                    </div>
                </li>
            );
        }
        return result
    }

    // 댓글 삭제
    deleteComment = (index) => {
        this.sweetalertDelete2('삭제하시겠습니까?', function () {

            axios.delete(`/api/nreply/${this.state.responseReplyList.data[index].rno}/${this.state.bno}`, {
                rNo: this.state.responseReplyList.data[index].rno,
                bNo: this.state.bno
            })
                .then(response => {
                }).catch(error => { alert('작업중 오류가 발생하였습니다.'); return false; });
        }.bind(this))
    };

    sweetalertDelete2 = (title, callbackFunc) => {
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
                    '삭제되었습니다.',
                    '',
                    'success'
                ).then(() => {
                    this.callReplyListApi(this.state.bno);
                });
            } else {
                return false;
            }
            callbackFunc()
        })
    }


    // 댓글 수정 모달 열기
    openEditModal = (index) => {
        this.setState({
            selectRno: this.state.responseReplyList.data[index].rno,
            isEditModalOpen: true,
            editedContent: this.state.responseReplyList.data[index].replyText,
        });
    };

    // 댓글 수정 모달 닫기
    closeEditModal = () => {
        this.setState({
            isEditModalOpen: false,
            editedContent: '',
        });
    };

    // 댓글 수정 저장
    handleEditSubmit = () => {

        axios.put(`/api/nreply/${this.state.selectRno}`, {
            rNo: this.state.selectRno,
            replyText: this.state.editedContent,
        })
            .then(response => {
                if (response.data == "SUCCESS") {
                    this.setState({
                        isEditModalOpen: false,
                    });
                    this.callReplyListApi(this.state.bno);
                }
            })
            .catch(error => { alert('댓글수정오류'); return false; });
    };



    render() {

        // 날짜표시방법
        const formattedRegidate = new Date(this.state.regidate).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).split('.').join('/').replace(/\s/g, '');

        const trimmedRegidate = formattedRegidate.slice(0, -1);

        return (
            <section class="sub_wrap">
                <article class="s_cnt mp_pro_li ct1">
                    <div class="li_top">
                        <h2 class="s_tit1">게 시 글</h2>
                    </div>
                    <div class="bo_w re1_wrap re1_wrap_writer">
                        <form name="frm" id="frm" action="" onsubmit="" method="post" >
                            <article class="res_w">
                                <div class="tb_outline">
                                    <table class="table_ty1">
                                        <tr>
                                            <th>
                                                <label for="title">제목</label>
                                            </th>
                                            <td>
                                                <input type="text" name="title" id="titleVal" readOnly="readonly" value={this.state.title} />
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="table_ty1">
                                        <tr>
                                            <th>
                                                <label for="writer">작성자</label>
                                            </th>
                                            <td>
                                                <input type="text" name="writer" id="writerVal" readOnly="readonly" value={this.state.writer} />
                                            </td>

                                            <th style={{ textAlign: "center" }}>
                                                <label for="regDate">작성일</label>
                                            </th>
                                            <td>
                                                <input type="text" name="regiDate" id="regiDateVal" readOnly="readonly" value={trimmedRegidate} />
                                            </td>

                                            <th style={{ textAlign: "center" }}>
                                                <label for="writer">조회수</label>
                                            </th>
                                            <td>
                                                <input type="text" name="viewCnt" id="viewCntVal" readOnly="readonly" value={this.state.viewCnt} />
                                            </td>
                                        </tr>
                                    </table>
                                    <table class="table_ty1">

                                        <tr>
                                            <th>
                                                <label for="Content">내용</label>
                                            </th>
                                            <td>
                                                <textarea style={{ padding: '15px' }} name="content" id="contentVal" rows="" cols="" readOnly="readonly" value={this.state.content}></textarea>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>
                                                파일목록
                                            </th>
                                            <td className="fileBox fileBox1">
                                                <ul id="upload_img">
                                                    {this.renderImages()}
                                                </ul>
                                            </td>
                                        </tr>
                                        <Modal
                                            isOpen={this.state.modalIsOpen}
                                            onRequestClose={this.closeImageModal}
                                            contentLabel="썸네일 이미지"
                                            style={{
                                                overlay: {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                                },
                                                content: {
                                                    width: '75%', // 원하는 너비로 설정하세요
                                                    height: '75%', // 원하는 높이로 설정하세요
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    overflow: 'auto',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                                }
                                            }}>
                                            {this.state.selectedImage && (
                                                <img src={`/display?fileName=${this.state.selectedImage}`} alt="선택한 썸네일" />
                                            )}
                                        </Modal>
                                    </table>
                                    <div id="modifyButton" class="btn_confirm mt20" style={{ "margin-bottom": "44px", textAlign: "center" }}>
                                        <Link to={`/NboardModify/${this.state.bno}`} className="bt_ty bt_ty2 submit_ty1 saveclass">수정</Link>
                                        <a href='javascript:' className="bt_ty bt_ty2 submit_ty1 saveclass"
                                            onClick={(e) => this.deleteArticle(e)}>삭제</a>
                                        <Link to={`/NboardList`} className="bt_ty bt_ty2 submit_ty1 saveclass">목록</Link>
                                    </div>
                                </div>
                            </article>
                        </form>


                        <div className='table_ty99'>댓글</div>

                        <form name="frm2" id="frm2" action="" onsubmit="" method="post">
                            <div className='line'></div>
                            <table class="table_ty1">
                                <tr id='bNoDiv'>
                                    <td>
                                        <input type="text" name="bNo" id="bnoVal" value={this.state.bno} />
                                    </td>

                                </tr>
                                <tr id='replyerDiv'>
                                    <td>
                                        <input type="text" name="replyer" id="replyerVal" value={this.state.memNickName} />
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="text" name="replyText" id="replyTextVal" placeholder='내용을 입력해주세요.' style={{ flex: '1', marginRight: '8px', height: '50px' }} />
                                        <a href="javascript:" className="bt_ty1 bt_ty3 submit_ty1 saveclass" onClick={(e) => this.submitClick(e)}>등록</a>
                                    </td>
                                </tr>

                            </table>

                        </form>
                        <div id='replyarea'>
                            <ul>
                                {this.state.append_ReplyList}
                            </ul>
                        </div>
                    </div>

                    <Modal
                        isOpen={this.state.isEditModalOpen}
                        onRequestClose={this.closeEditModal}
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            content: {
                                width: '30%', // 원하는 너비로 설정하세요
                                height: '30%', // 원하는 높이로 설정하세요
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                overflow: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white'
                            }
                        }}
                    >
                        <h2>댓글 수정</h2>
                        <br></br>
                        <input style={{ height: '30%', width: '80%', padding: '15px' }}
                            value={this.state.editedContent}
                            onChange={(e) => this.setState({ editedContent: e.target.value })}
                        ></input>
                        <br></br>
                        <div style={{ display: 'flex' }}>
                            <button className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={this.handleEditSubmit}>저장</button>
                            <button className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={this.closeEditModal}>취소</button>
                        </div>
                    </Modal>
                </article>
            </section>
        );
    }
}

export default NboardRead;