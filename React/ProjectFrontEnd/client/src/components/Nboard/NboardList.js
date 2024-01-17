import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'

class NboardList extends Component {
    constructor(props) {
        super(props);

        // 상태 초기화
        this.state = {
            responseNboardList: '',
            responseSboardList: '',
            append_NboardList: '',
            append_SboardList: '',
            currentPage: 1,
            totalPages: '',
            startPage: '',
            endPage: '',
            keyword: '',
            searchtype: ''
        }
    }

    componentDidMount() {
        this.callNboardListApi(this.state.currentPage)
        $("#spaging").hide();
    }

    // 일반 게시판 목록을 불러오는 함수
    callNboardListApi = async (page) => {
        axios.get(`/api/nBoard/list/${page}`)
            .then(response => {
                try {
                    this.setState({ responseNboardList: response });
                    this.setState({ append_NboardList: this.nBoardListAppend() });
                    this.setState({ totalPages: response.data.pageMaker.totalPage });
                    this.setState({ startPage: response.data.pageMaker.startPage });
                    this.setState({ endPage: response.data.pageMaker.endPage });
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다1.');
                }
            })
            .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
    }

    // 검색된 게시판 목록을 불러오는 함수
    callSboardListApi = async (page) => {

        if (this.state.searchtype != '' && this.state.keyword != '') {
            axios.get(`/api/nBoard/list/${page}?searchType=${this.state.searchtype}&keyword=${this.state.keyword}`)
                .then(response => {
                    try {
                        // 검색된 목록으로 상태 업데이트
                        this.setState({ responseSboardList: response });
                        this.setState({ append_SboardList: this.sBoardListAppend() });
                        const totalPages = response.data.pageMaker.totalPage;
                        const startPage = response.data.pageMaker.startPage;
                        const endPage = response.data.pageMaker.endPage;
                        this.setState({ totalPages, startPage, endPage });
                        $("#cpaging").hide();
                        $("#spaging").show();

                    } catch (error) {
                        alert('작업중 오류가 발생하였습니다1.');
                    }
                })
                .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
        } else {
            this.sweetalert('검색조건을 확인해주세요.', '', 'error', '닫기')
        }
    }

    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        }).then(function () {
            window.location.reload();
        })
    }

    // 페이지 클릭에 대응하는 함수
    handlePageClick = (page) => {
        if (this.state.keyword == '' || this.state.searchtype == '') {
            this.setState({ currentPage: page }, () => {
                this.callNboardListApi(page);
            });
        } else {
            this.setState({ currentPage: page }, () => {
                this.callSboardListApi(page);
            });
        }
    }

    // 일반 게시판 페이지 번호 버튼을 렌더링하는 함수
    renderPagination = () => {
        const { currentPage, totalPages } = this.state;
        const pagesPerGroup = 5; // 페이지 그룹 당 페이지 수
        const pageNumbers = [];
        const currentPageGroup = Math.ceil(currentPage / pagesPerGroup);
        let startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
        let endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

        // 현재 페이지 그룹에 따라 시작 및 끝 페이지 조절
        if (currentPageGroup > 1) {
            startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
            endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
        }

        // 페이지 번호 버튼 생성
        for (let i = startPage; i <= endPage; i++) {
            const isCurrentPage = i === currentPage;
            pageNumbers.push(
                <button style={{ margin: 5, backgroundColor: isCurrentPage ? '#a4d1ae' : '' }}
                    className={`sch_bt99 wi_au ${isCurrentPage ? 'current-page' : ''}`} key={i} onClick={() => this.handlePageClick(i)}>
                    {i}
                </button>
            );
        }

        // Pagination 컴포넌트 렌더링
        return (
            <div className="Paging">
                {currentPageGroup > 1 && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => this.handlePageClick(startPage - 1)}>
                        {'<'}
                    </button>
                )}
                {pageNumbers}
                {endPage < totalPages && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => this.handlePageClick(endPage + 1)}>
                        {'>'}
                    </button>
                )}
            </div>
        );
    }


    // 검색 결과 페이지 번호 버튼을 렌더링하는 함수
    renderSearchPagination = () => {
        const { currentPage, totalPages } = this.state;
        const pagesPerGroup = 5;
        const pageNumbers = [];
        const currentPageGroup = Math.ceil(currentPage / pagesPerGroup);
        let startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
        let endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

        if (currentPageGroup > 1) {
            startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
            endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isCurrentPage = i === currentPage;
            pageNumbers.push(
                <button style={{ margin: 5, backgroundColor: isCurrentPage ? '#a4d1ae' : '' }}
                    className={`sch_bt99 wi_au ${isCurrentPage ? 'current-page' : ''}`} key={i} onClick={() => this.handlePageClick(i)}>
                    {i}
                </button>
            );
        }

        return (
            <div className="Paging">
                {currentPageGroup > 1 && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => this.handlePageClick(startPage - 1)}>
                        {'<'}
                    </button>
                )}
                {pageNumbers}
                {endPage < totalPages && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => this.handlePageClick(endPage + 1)}>
                        {'>'}
                    </button>
                )}
            </div>
        );
    }

    // 일반 게시판 목록을 렌더링하는 함수
    nBoardListAppend = () => {
        let result = []
        var nBoardList = this.state.responseNboardList.data.list

        for (let i = 0; i < nBoardList.length; i++) {
            var data = nBoardList[i]
            const formattedDate = new Date(data.regidate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).split('.').join('/').replace(/\s/g, '');

            const trimmedDate = formattedDate.slice(0, -1);

            result.push(
                <tr class="hidden_type">
                    <td>{data.bno}</td>
                    <td><Link to={`NboardRead/${data.bno}`}>{data.title}{data.replyCnt > 0 && `[${data.replyCnt}]`}</Link></td>
                    <td>{data.writer}</td>
                    <td>{data.viewCnt}</td>
                    <td>{trimmedDate}</td>
                </tr>
            )
        }
        return result
    }

    // 검색된 게시판 목록을 렌더링하는 함수
    sBoardListAppend = () => {
        let result = []
        var sBoardList = this.state.responseSboardList.data.list

        for (let i = 0; i < sBoardList.length; i++) {
            var data = sBoardList[i]
            const formattedDate = new Date(data.regidate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).split('.').join('/').replace(/\s/g, '');

            const trimmedDate = formattedDate.slice(0, -1);

            result.push(
                <tr class="hidden_type">
                    <td>{data.bno}</td>
                    <td><Link to={`NboardRead/${data.bno}`}>{data.title}{data.replyCnt > 0 && `[${data.replyCnt}]`}</Link></td>
                    <td>{data.writer}</td>
                    <td>{data.viewCnt}</td>
                    <td>{trimmedDate}</td>
                </tr>
            )
        }
        return result
    }

    // 검색어 입력 값 변경 핸들러
    handleSearchValChange = (e) => {
        this.setState({ keyword: e.target.value });
    };

    // 검색 유형 변경 핸들러
    handleSearchTypeChange = (e) => {
        this.setState({ searchtype: e.target.value });
    };

    // 검색 버튼 클릭 핸들러
    handleSearchButtonClick = (e) => {
        e.preventDefault();
        $("#appendNboardList").hide();
        this.callSboardListApi(this.state.currentPage); // 검색 버튼 클릭 시 검색 기능 호출
    };

    render() {
        return (
            <section class="sub_wrap" >
                <article class="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div class="li_top">
                        <h2 class="s_tit1">공 지 사 항</h2>
                        <div class="li_top_sch af">
                            <Link to={'/NboardRegister'} className="sch_bt2 wi_au">글쓰기</Link>
                        </div>
                    </div>

                    <div class="list_cont list_cont_admin">
                        <table class="table_ty1 ad_tlist">
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>조회수</th>
                                <th>작성일</th>
                            </tr>
                        </table>
                        <table id="appendNboardList" class="table_ty2 ad_tlist">
                            {this.state.append_NboardList}
                        </table>
                        <table id="appendSboardList" class="table_ty2 ad_tlist">
                            {this.state.append_SboardList}
                        </table>
                    </div>
                    <br></br>
                    <div id="cpaging">
                        {this.renderPagination()}
                    </div>
                    <div id="spaging">
                        {this.renderSearchPagination()}
                    </div>
                    <br></br>
                    <div className="searchingForm" >
                        <form onSubmit={(e) => this.handleSearchButtonClick(e)}>
                            <select value={this.state.searchtype} onChange={this.handleSearchTypeChange} className="searchzone">
                                <option value="">선택</option>
                                <option value="t">제목</option>
                                <option value="c">내용</option>
                                <option value="w">작성자</option>
                            </select>
                            <input className='search'
                                type="text"
                                placeholder="검색어를 입력해주세요."
                                value={this.state.keyword}
                                onChange={this.handleSearchValChange}
                            />
                            <button type="submit" className="sch_bt99 wi_au">검색</button>
                        </form>
                    </div>
                </article>
            </section>
        );
    }
}

export default NboardList;