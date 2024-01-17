import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import $ from 'jquery';

const Header = () => {
    // useState 훅을 사용하여 상태 변수를 선언합니다.
    const [memNickName, setMemNickName] = useState('');
    const [activeMenu, setActiveMenu] = useState('/');
    const [menuVisible, setMenuVisible] = useState(false);

    // useEffect 훅을 사용하여 컴포넌트 생명주기 이벤트를 처리합니다.
    useEffect(() => {
        // componentDidMount 역할
        if (
            window.location.pathname.endsWith('/') ||
            window.location.pathname.includes('/login') ||
            window.location.pathname.includes('/Register')
        ) {
            $('header').hide();
        }

        // 쿠키에서 사용자 데이터를 로드합니다.
        const cookie_memId = cookie.load('memId');
        const cookie_memNickName = cookie.load('memNickName');
        const cookie_memPw = cookie.load('memPw');
        setMemNickName(cookie_memNickName);

        // 'memId' 쿠키의 존재 여부를 확인하여 사용자가 로그인했는지 확인합니다.
        if (cookie_memId !== undefined) {
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 60);

            // 사용자 데이터를 쿠키에 저장하고 메뉴 엘리먼트를 표시합니다.
            cookie.save('memId', cookie_memId, { path: '/', expires });
            cookie.save('memNickName', cookie_memNickName, { path: '/', expires });
            cookie.save('memPw', cookie_memPw, { path: '/', expires });

            $('.menulist').show();
            $('.hd_top').show();
        } else {
            // 사용자가 로그인하지 않은 경우 메뉴 엘리먼트를 숨깁니다.
            $('.menulist').hide();
            $('.hd_top').hide();
        }
    }, []);

    // 사용자 로그아웃을 처리하는 함수
    const logout = async () => {
        cookie.remove('memId', { path: '/' });
        cookie.remove('memNickName', { path: '/' });
        cookie.remove('memPw', { path: '/' });
        window.location.href = '/login';
    };

    // 메뉴 아이템 클릭을 처리하는 함수
    const handleMenuClick = (path) => {
        setActiveMenu(path);
        setMenuVisible(false);
    };

    // 모바일 메뉴의 가시성을 전환하는 함수
    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <header className="gnb_box">
            <div className="hd_top">
                <div className="top_wrap ct1 af">
                    <span>Where?</span>
                    <div className="hd_right">
                        <p>
                            <span>'{memNickName}'</span>님 안녕하세요.
                        </p>
                        <button type="button" onClick={logout}>
                            로그아웃
                        </button>
                    </div>
                </div>

            </div>
            <div className="h_nav ct1 af">
                <div className="logo">
                    <img src={require('../../img/layout/자동차2.gif')} height="65px" width="200px" alt="" />
                </div>
                <div className={`menu-icon ${menuVisible ? 'open' : ''}`} onClick={toggleMenu}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <div className="hbrfont">
                    <nav className={`nav ${menuVisible ? 'show-menu' : ''}`}>
                        <ul className="menubar">
                            <li className={`menulist ${window.location.pathname === '/MainForm' ? 'active' : ''}`}>
                                <Link to={'/MainForm'} onClick={() => handleMenuClick('/MainForm')}>
                                    홈
                                </Link>
                            </li>
                            <li className={`menulist ${window.location.pathname === '/findStation' ? 'active' : ''}`}>
                                <Link to={'/findStation'} onClick={() => handleMenuClick('/findStation')}>
                                    충전소 검색
                                </Link>
                            </li>
                            <li className={`menulist ${window.location.pathname === '/NboardList' ? 'active' : ''}`}>
                                <Link to={'/NboardList'} onClick={() => handleMenuClick('/NboardList')}>
                                    공지사항
                                </Link>
                            </li>
                            <li className="menulist">
                                <Link to={'/FboardList'} onClick={() => handleMenuClick('')}>
                                    커뮤니티
                                </Link>
                            </li>
                            <li className="menulist">
                                <Link to={'/VboardList'} onClick={() => handleMenuClick('')}>
                                    리뷰쓰기
                                </Link>
                            </li>
                            <li className="menulist">
                                <Link to={'/QboardList'} onClick={() => handleMenuClick('')}>
                                    문의하기
                                </Link>
                            </li>
                            <li className={`menulist ${window.location.pathname === '/MyPage' ? 'active' : ''}`}>
                                <Link to={'/MyPage'} onClick={() => handleMenuClick('/MyPage')}>
                                    마이페이지
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
