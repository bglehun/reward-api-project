## 적립금 API 개발

### 환경

```bash
프레임워크: Nest
ORM: Typeorm
DB: mysql (Local pc에 mysql 설치 필요)

<필수 환경 변수>
MYSQL_DATABASE
MYSQL_HOST
MYSQL_USERNAME
MYSQL_PASSWORD
MYSQL_PORT
PAGINATION_LIMIT # 적립금 내역 조회 시 페이지네이션 단위

Swagger 링크: localhost:3000/docs
```
### 구현 목록
```bash
[필수 기능]

- 적립금 합계 조회 API
회원 Table과 인증 과정은 구현하지 않음.
Path params로 userId 입력 시 회원의 적립금 정보가 응답.
만약, 적립금 정보가 없으면 초기 데이터 생성 후 응답.


- 적립금 내역 조회 API (cursor 페이지네이션 적용)
cursor 페이지네이션을 적용.
커버링 인덱스를 사용해 응답할 적립금 내역의 id값을 추출 후,
innerJoin으로 데이터를 조회.
(where in 으로도 처리 가능하지만, connection을 줄이기 위해 join 적용)

- 적립금 적립 API
적립금이 발생한 거래의 유니크한 tdId를 필수로 받아야함.

- 적립금 차감 API
적립금을 사용한 거래의 유니크한 tdId를 필수로 받아야함.
적립금 사용 시, 먼저 적립된 순서로 사용되며, 차감한 적립금 정보를 관리하여(usedRewardList) 추후 롤백할 경우 참조하여 적립금을 롤백할 계획.
적립금에 관련된 필드들은 unsigned로 설정하여 음수가 될 수 없게 설정.

[추가 기능]

- 적립금 만료 (Nestjs Middleware 사용)
Reward API 호출 시 controller 실행 전에 적립금 만료 처리 Middleware 실행.
조회 시점으로부터 1년 전 날짜 이전의 데이터를 조회하여 만료 처리.
```

## 서버 실행

```bash
# packege 설치
$ npm install

# 서버 실행
$ npm run start

# watch 모드
$ npm run start:dev

Swagger 문서에 접속 후 API 호출 테스트 가능.
```

## e2e 테스트

```bash
# app.e2e-spec.ts 파일에 테스트 코드 작성.
# 최초 실행 시 trId 값을 유니크한 값으로 변경해야 함.
$ npm run test:e2e

# unit 테스트 코드는 작성해본 경험이 없습니다.
# 작성해보려 했지만, typeorm 관련 의존성 문제가 발생하여 작성하지 못했습니다.
```
### e2e 테스트 결과
![e2e결과](https://user-images.githubusercontent.com/96781806/229514811-7702e449-1929-4292-804b-c19a4e6a11ae.png)