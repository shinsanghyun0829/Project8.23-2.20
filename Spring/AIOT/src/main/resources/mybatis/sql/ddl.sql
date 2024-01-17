-- 1. oracle db인 경우
-- AIOT/AIOT@XE로 로그인한 후,
CREATE USER AIOT IDENTIFIED BY AIOT;
GRANT CONNECT, RESOURCE TO AIOT;


--member테이블 생성
drop table carRegi;
drop table MEMBER;
CREATE TABLE MEMBER (
    memNo NUMBER PRIMARY KEY,
    memId VARCHAR2(100) NOT NULL UNIQUE,
    memPw VARCHAR2(200)  NOT NULL,
    memNickName VARCHAR2(100) NOT NULL,
    memName VARCHAR2(100) NOT NULL,
    regdate TIMESTAMP DEFAULT SYSTIMESTAMP
);

drop SEQUENCE memNo_seq;
CREATE SEQUENCE memNo_seq
START WITH 1 INCREMENT BY 1  NOMAXVALUE  NOCYCLE;

drop TRIGGER memNo_trigger;
CREATE OR REPLACE TRIGGER memNo_trigger
BEFORE INSERT ON MEMBER
FOR EACH ROW
BEGIN
    SELECT memNo_seq.NEXTVAL INTO :new.memNo FROM dual;
END;
/


-- 차량등록 테이블
CREATE TABLE carRegi (
    carNo NUMBER PRIMARY KEY, -- 차량ID
    carNum VARCHAR2(20) NOT NULL, --차량번호
    carBrand VARCHAR2(50) NOT NULL, --차량브랜드
    carModel VARCHAR2(50) NOT NULL, --차량모델
    charType VARCHAR2(20) NOT NULL, -- 충전방식
    regidate TIMESTAMP DEFAULT SYSTIMESTAMP, --차량등록날짜
    memId VARCHAR2(100) NOT NULL UNIQUE,
    FOREIGN KEY (memId) REFERENCES Member(memId),
    CONSTRAINT unique_carNum UNIQUE (carNum) -- 차량번호 중복등록 금지
);

drop SEQUENCE cNo_seq;
CREATE SEQUENCE cNo_seq
START WITH 1 INCREMENT BY 1  NOMAXVALUE  NOCYCLE;

drop TRIGGER cNo_trigger;
CREATE OR REPLACE TRIGGER cNo_trigger
BEFORE INSERT ON carRegi
FOR EACH ROW
BEGIN
    SELECT cNo_seq.NEXTVAL INTO :new.carNo FROM dual;
END;
/


--게시판
drop table nReply;
drop table nAttach;
drop table nBoard;
CREATE table nBoard (
 bNo number PRIMARY KEY, 
 writer varchar2(100) , 
 title varchar2(500) ,
 content CLOB,
 viewCnt number(10) default 0,
 replyCnt number(10),
 regidate  TIMESTAMP DEFAULT SYSTIMESTAMP
);

drop SEQUENCE bNo_seq;
CREATE SEQUENCE bNo_seq
START WITH 1 INCREMENT BY 1  NOMAXVALUE  NOCYCLE;

drop TRIGGER bNo_trigger;
CREATE OR REPLACE TRIGGER bNo_trigger
BEFORE INSERT ON nBoard
FOR EACH ROW
BEGIN
    SELECT bNo_seq.NEXTVAL INTO :new.bNo FROM dual;
END;
/


--댓글
CREATE table nReply (
 rNo number  primary KEY,
 bNo number,
 replytext varchar2(1000),
 replyer varchar2(20),
 updateRegdate TIMESTAMP DEFAULT SYSTIMESTAMP,
 regdate TIMESTAMP DEFAULT SYSTIMESTAMP
);

ALTER TABLE nReply
ADD CONSTRAINT fk_bNo
FOREIGN KEY (bNo)
REFERENCES nBoard(bNo)
ON DELETE CASCADE;

drop SEQUENCE rNo_seq;
CREATE SEQUENCE rNo_Seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

drop TRIGGER rNo_trigger;
CREATE OR REPLACE TRIGGER rNo_trigger
BEFORE INSERT ON nReply
FOR EACH ROW
BEGIN
    SELECT rNo_seq.NEXTVAL INTO :new.rNo FROM dual;
END;
/


--첨부파일
CREATE TABLE nAttach (
  uuid VARCHAR2(200),
  imgName varchar2(200),
  bNo NUMBER,
  aNo NUMBER,
  path VARCHAR2(200),
  regdate TIMESTAMP DEFAULT SYSTIMESTAMP 
 );

ALTER TABLE nAttach
ADD CONSTRAINT fk_bNo_nAttach
FOREIGN KEY (bNo)
REFERENCES nBoard(bNo)
ON DELETE CASCADE;

drop SEQUENCE aNo_seq;
CREATE SEQUENCE aNo_seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

drop TRIGGER aNo_trigger;
CREATE OR REPLACE TRIGGER aNo_trigger
BEFORE INSERT ON nAttach
FOR EACH ROW
BEGIN
    SELECT aNo_seq.NEXTVAL INTO :new.aNo FROM dual;
END;
/