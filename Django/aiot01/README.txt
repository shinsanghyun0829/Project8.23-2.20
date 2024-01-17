1. DB(MySQL) 설정
-- root 계정으로 설정
create database aiot default character set utf8;
create user 'aiot'@'localhost' identified by 'aiot';
grant all privileges on aiot.* to 'aiot'@'localhost';
create user 'aiot'@'%' identified by 'aiot';
grant all privileges on aiot.* to 'aiot'@'%';

2. 마이그레이션 설정
python manage.py makemigrations
python manage.py createsuperuser
admin
admin@naver.com
admin
python manage.py migrate

3. 공공데이터 수집
python manage.py fetchchargingstations

4. cors 설정
cmd 관리자로 열어서 pip install django-cors-headers

INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

# 미들웨어 설정
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 상단에 작성
    # ...
]

CORS_ALLOW_ALL_ORIGINS = True 모든 도메인 허용


5. django 실행
python manage.py runserver

