# Design Token Sync

Figma에서 추출한 디자인 토큰을 동기화하고 관리하는 웹 애플리케이션입니다.

## 📋 프로젝트 개요

이 프로젝트는 Figma에서 내보낸 디자인 토큰 JSON 파일을 업로드하고, 이를 CSS 변수로 변환하여 GitHub Actions를 통해 자동으로 Pull Request를 생성하는 도구입니다.

### 주요 기능
- Figma 디자인 토큰 JSON 파일 업로드
- Style Dictionary를 통한 CSS 변수 자동 생성
- GitHub Actions를 통한 자동 Pull Request 생성
- Vue.js 기반 웹 인터페이스
- Express.js 백엔드 API

## 🏗️ 프로젝트 구조

```
design-token-sync/
├── .github/
│   └── workflows/
│       └── update-design-tokens.yml    # GitHub Actions 워크플로우
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── InputToken.vue          # 파일 업로드 컴포넌트
│   │   └── App.vue                     # 메인 애플리케이션
│   └── package.json
├── style-dictionary/
│   ├── config.json                     # Style Dictionary 설정
│   └── tokens.json                     # Figma 디자인 토큰
├── styles/
│   └── variables.css                   # 생성된 CSS 변수
├── build/
│   └── css/
│       └── variables.css               # Style Dictionary 빌드 결과
├── index.js                            # Express API 서버
├── package.json                        # 백엔드 의존성
└── README.md
```

## 🔄 워크플로우

1. **프론트엔드에서 JSON 파일 업로드**
   - Vue.js 웹 인터페이스에서 Figma 토큰 JSON 파일 선택
2. **백엔드 API에서 토큰 처리**
   - JSON 파일 저장 (`style-dictionary/tokens.json`)
   - Style Dictionary로 CSS 변환 (`build/css/variables.css`)
   - Git 브랜치 생성 및 푸시
   - GitHub Actions 트리거 (`repository_dispatch`)
3. **GitHub Actions에서 자동 PR 생성**
   - CSS 파일 변경사항 감지
   - 자동 Pull Request 생성

## 🚀 실행 방법

### 1. 환경변수 설정

```bash
# .env 파일 생성
cp env.example .env

# .env 파일 편집
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repository-name
GITHUB_TOKEN=your-github-personal-access-token
```

### 2. 의존성 설치

```bash
# 백엔드 의존성 설치
npm install

# 프론트엔드 의존성 설치
cd frontend
npm install
```

### 3. 서버 실행

```bash
# 백엔드 API 서버 (터미널 1)
npm start

# 프론트엔드 개발 서버 (터미널 2)
cd frontend
npm run dev
```

### 4. 브라우저에서 확인

- 프론트엔드: `http://localhost:5173`
- 백엔드 API: `http://localhost:3000`

## 🔧 사용 방법

1. **GitHub Personal Access Token 생성**
   - GitHub Settings → Developer settings → Personal access tokens
   - `repo` 권한 필요

2. **환경변수 설정**
   - `.env` 파일에 GitHub 정보 입력

3. **애플리케이션 실행**
   - 백엔드와 프론트엔드 서버 모두 실행

4. **디자인 토큰 업로드**
   - 브라우저에서 애플리케이션 접속
   - Figma에서 내보낸 JSON 파일 선택
   - "전송하기" 버튼 클릭

5. **자동 PR 생성 확인**
   - GitHub 저장소에서 자동 생성된 PR 확인


## 🛠️ 기술 스택

- **프론트엔드**: Vue.js 3, Vite
- **백엔드**: Node.js, Express.js
- **디자인 토큰**: Style Dictionary
- **자동화**: GitHub Actions
- **버전 관리**: Git

## 🔍 문제 해결

### GitHub Actions가 실행되지 않는 경우
1. GitHub 토큰 권한 확인 (`repo` 권한 필요)
2. 환경변수 설정 확인
3. GitHub Actions 로그 확인

### CSS 변환이 안 되는 경우
1. Style Dictionary 설치 확인: `npm install style-dictionary`
2. `style-dictionary/config.json` 설정 확인
3. JSON 파일 형식 확인

### API 서버 연결 오류
1. 포트 3000이 사용 가능한지 확인
2. CORS 설정 확인
3. 환경변수 설정 확인

### JSON 파일 업로드 오류
1. 파일 크기 제한 확인 (현재 50MB로 설정)
2. JSON 형식 유효성 확인
3. 서버 로그 확인

