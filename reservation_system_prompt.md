# 예약 시스템 프론트엔드/백엔드 기능 명세서

## 시스템 개요
3개의 사용자 역할(관리자, 점포, 일반사용자)을 가진 예약 관리 시스템

---

## 백엔드 (서버) 기능 명세

### 1. 인증 및 권한 관리
#### API 엔드포인트
- `POST /api/auth/login` - 로그인 (역할별 구분)
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/refresh` - 토큰 갱신
- `GET /api/auth/verify` - 토큰 검증

#### 기능
- JWT 토큰 기반 인증
- 역할 기반 접근 제어 (RBAC)
- 세션 관리 및 보안 처리
- 비밀번호 암호화 (bcrypt)

### 2. 관리자 API
#### 점포 관리
- `GET /api/admin/stores` - 점포 목록 조회
- `POST /api/admin/stores` - 점포 등록
- `GET /api/admin/stores/:id` - 점포 상세 조회
- `PUT /api/admin/stores/:id` - 점포 정보 수정
- `DELETE /api/admin/stores/:id` - 점포 삭제

#### 예약 현황 관리
- `GET /api/admin/reservations` - 전체 예약 현황 조회
- `GET /api/admin/reservations/stats` - 예약 통계
- `GET /api/admin/reservations/export` - 예약 데이터 내보내기

### 3. 점포 API
#### 점포 정보 관리
- `GET /api/store/profile` - 점포 정보 조회
- `PUT /api/store/profile` - 점포 정보 수정
- `POST /api/store/images` - 점포 이미지 업로드
- `DELETE /api/store/images/:id` - 점포 이미지 삭제

#### 예약 관리
- `GET /api/store/reservations` - 점포 예약 현황 조회
- `PUT /api/store/reservations/:id/status` - 예약 상태 변경
- `DELETE /api/store/reservations/:id` - 예약 취소
- `GET /api/store/reservations/calendar` - 예약 달력 조회

### 4. 사용자 API
#### 점포 조회
- `GET /api/stores` - 점포 목록 조회 (필터링, 검색)
- `GET /api/stores/:id` - 점포 상세 정보
- `GET /api/stores/search` - 점포 검색
- `GET /api/stores/:id/availability` - 예약 가능 시간 조회

#### 예약 관리
- `POST /api/reservations` - 예약 생성
- `GET /api/reservations` - 개인 예약 현황 조회
- `PUT /api/reservations/:id/cancel` - 예약 취소
- `GET /api/reservations/:id` - 예약 상세 조회

### 5. 데이터베이스 설계
#### 테이블 구조
```sql
-- 사용자 테이블
users (id, email, password, role, created_at, updated_at)

-- 점포 테이블
stores (id, name, description, address, phone, operating_hours, owner_id, created_at, updated_at)

-- 예약 테이블
reservations (id, store_id, user_id, reservation_date, start_time, end_time, status, notes, created_at, updated_at)

-- 점포 이미지 테이블
store_images (id, store_id, image_url, is_primary, created_at)
```

#### 보안 및 검증
- 입력 데이터 검증 및 sanitization
- SQL 인젝션 방지
- Rate limiting
- CORS 설정
- API 응답 표준화

---

## 프론트엔드 기능 명세

### 1. 공통 컴포넌트
#### 인증 관련
- `LoginForm` - 로그인 폼 (역할별 구분)
- `AuthGuard` - 권한 기반 라우트 보호
- `TokenManager` - 토큰 관리 및 자동 갱신

#### UI 컴포넌트
- `Header/Navigation` - 역할별 네비게이션
- `Sidebar` - 관리자/점포용 사이드바
- `LoadingSpinner` - 로딩 상태 표시
- `Modal` - 모달 다이얼로그
- `Toast/Notification` - 알림 메시지

### 2. 관리자 페이지
#### 대시보드
- `AdminDashboard`
  - 전체 예약 현황 요약
  - 점포별 예약 통계
  - 최근 등록된 점포 목록
  - 실시간 예약 알림
  - 시스템 상태 모니터링

#### 점포 관리
- `StoreList`
  - 점포 목록 테이블/그리드 뷰
  - 점포 검색 및 필터링
  - 정렬 기능 (이름, 등록일, 예약 수 등)
  - 페이지네이션
  - 일괄 작업 기능

- `StoreForm`
  - 점포 기본 정보 입력
  - 영업 시간 설정
  - 위치 정보 (지도 연동)
  - 예약 정책 설정
  - 이미지 업로드 관리

- `StoreDetail`
  - 점포 상세 정보 표시
  - 예약 현황 그래프
  - 리뷰 및 평점 관리
  - 운영 통계
  - 수정/삭제 기능

- `StoreDeleteModal`
  - 삭제 확인 다이얼로그
  - 연관 데이터 처리 옵션
  - 삭제 이력 관리

#### 예약 현황 관리
- `ReservationOverview`
  - 전체 예약 현황 대시보드
  - 예약 상태별 필터링
  - 날짜별/시간대별 조회
  - 점포별 예약 현황

- `ReservationStats`
  - 예약 통계 차트
    - 일별/주별/월별 예약 추이
    - 점포별 예약 분포
    - 시간대별 예약 밀도
    - 취소율 및 노쇼율 분석
  - 데이터 시각화
    - 히트맵
    - 파이 차트
    - 라인 그래프
    - 바 차트

- `ReservationExport`
  - 데이터 내보내기 옵션
    - Excel 형식
    - CSV 형식
    - PDF 리포트
  - 커스텀 필터링
  - 기간 설정
  - 자동 리포트 생성

#### 시스템 관리
- `SystemSettings`
  - 시스템 설정 관리
  - 사용자 권한 관리
  - 알림 설정
  - 백업/복구 관리

- `UserManagement`
  - 사용자 목록 관리
  - 권한 설정
  - 계정 상태 관리
  - 활동 로그 조회

- `NotificationCenter`
  - 시스템 알림 관리
  - 알림 템플릿 설정
  - 알림 발송 이력
  - 실시간 알림 모니터링

#### 보고서 및 분석
- `ReportGenerator`
  - 커스텀 리포트 생성
  - 데이터 분석 도구
  - 트렌드 분석
  - 성과 지표 대시보드

- `AuditLog`
  - 시스템 활동 로그
  - 사용자 활동 추적
  - 보안 이벤트 모니터링
  - 로그 필터링 및 검색

### 3. 점포 페이지
**점포 관리**
- `StoreDashboard` - 점포 대시보드
- `StoreProfile` - 점포 정보 조회/수정
- `ImageUpload` - 이미지 업로드 컴포넌트
- `ImageGallery` - 이미지 갤러리

**예약 관리**
- `ReservationCalendar` - 예약 달력 뷰
- `ReservationList` - 예약 목록
- `ReservationDetail` - 예약 상세 정보
- `ReservationStatus` - 예약 상태 변경
- `ReservationNotifications` - 실시간 알림

### 4. 사용자 페이지
**점포 탐색**
- `HomePage` - 메인 페이지
- `StoreGrid` - 점포 그리드 뷰
- `StoreCard` - 점포 카드 컴포넌트
- `StoreDetail` - 점포 상세 페이지
- `SearchBar` - 검색 바
- `FilterPanel` - 필터 패널

**예약 기능**
- `ReservationForm` - 예약 신청 폼
- `DateTimePicker` - 날짜/시간 선택
- `AvailabilityChecker` - 예약 가능 시간 확인
- `MyReservations` - 개인 예약 현황
- `ReservationHistory` - 예약 이력

### 5. 상태 관리 및 데이터 흐름
**상태 관리 (Redux/Zustand)**
- `authSlice` - 인증 상태 관리
- `storeSlice` - 점포 데이터 상태
- `reservationSlice` - 예약 데이터 상태
- `uiSlice` - UI 상태 (로딩, 모달 등)

**API 통신**
- `apiClient` - Axios 기반 API 클라이언트
- `authInterceptor` - 인증 토큰 자동 첨부
- `errorHandler` - 에러 처리 및 사용자 알림
- `cacheManager` - API 응답 캐싱

### 6. 라우팅 구조
```
/admin
  /dashboard
  /stores
  /stores/new
  /stores/:id/edit
  /reservations

/store
  /dashboard
  /profile
  /reservations
  /calendar

/
/stores
/stores/:id
/reservations
/my-reservations
```

### 7. 반응형 디자인 및 UX
**모바일 최적화**
- 터치 친화적 인터페이스
- 모바일 네비게이션
- 스와이프 제스처 지원

**사용자 경험**
- 실시간 데이터 업데이트 (WebSocket/SSE)
- 오프라인 상태 처리
- 폼 검증 및 실시간 피드백
- 접근성 (ARIA 라벨, 키보드 네비게이션)

---

## 개발 환경 및 도구

### 백엔드
- **언어**: Node.js/Express 또는 Python/Django 또는 Java/Spring Boot
- **데이터베이스**: PostgreSQL 또는 MySQL
- **인증**: JWT
- **파일 저장**: AWS S3 또는 로컬 스토리지
- **실시간 통신**: Socket.IO 또는 WebSocket

### 프론트엔드
- **프레임워크**: React/Next.js 또는 Vue/Nuxt.js
- **상태 관리**: Redux Toolkit 또는 Zustand
- **스타일링**: Tailwind CSS 또는 Styled-components
- **HTTP 클라이언트**: Axios
- **빌드 도구**: Vite 또는 Webpack