# Design Token Sync

Figma에서 추출한 디자인 토큰을 동기화하고 관리하는 웹 애플리케이션입니다.

## 📋 프로젝트 개요

이 프로젝트는 Figma에서 내보낸 디자인 토큰 JSON 파일을 업로드하고, 이를 CSS 변수로 변환하여 GitHub Actions를 통해 자동으로 Pull Request를 생성하는 도구입니다.

### 주요 기능
- Figma 디자인 토큰 JSON 파일 업로드
- Style Dictionary를 통한 CSS 변수 자동 생성
- GitHub Actions를 통한 자동 Pull Request 생성
- Vue.js 기반 웹 인터페이스

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
├── index.js                            # Express API 서버
└── README.md
```

## 🔄 워크플로우

1. **프론트엔드에서 JSON 파일 업로드**
2. **백엔드 API에서 토큰 처리**
   - JSON 파일 저장
   - Style Dictionary로 CSS 변환
   - Git 브랜치 생성 및 푸시
   - GitHub Actions 트리거
3. **GitHub Actions에서 자동 PR 생성**

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
# 루트 디렉토리
npm install

# 프론트엔드
cd frontend
npm install
```

### 3. 서버 실행

```bash
# 백엔드 API 서버
npm start

# 프론트엔드 개발 서버
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

## 📁 디자인 토큰 구조

프로젝트에는 다음과 같은 디자인 토큰들이 포함되어 있습니다:

### 색상 (Colors)
- Primary, Secondary 색상
- Gray, Blue, Indigo, Purple, Pink, Red, Orange, Yellow, Green, Teal, Cyan 팔레트
- 각 색상은 100-900 단계로 구성

### 타이포그래피 (Typography)
- Bold, ExtraBold, SemiBold, Body 텍스트 스타일
- H1-H6 헤딩 스타일
- Display 텍스트 스타일

### 간격 (Spacing)
- 4px부터 48px까지의 간격 시스템

### 반지름 (Radius)
- 기본, 작은, 큰, 매우 큰, 알약 모양의 반지름

### 효과 (Effects)
- 작은, 일반, 큰 그림자 효과

## 🛠️ 기술 스택

- **프론트엔드**: Vue.js 3, Vite
- **백엔드**: Node.js, Express
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

## 📝 개발 예정 사항

- [ ] 다중 토큰 파일 지원
- [ ] 토큰 미리보기 기능
- [ ] 토큰 검증 기능
- [ ] Slack/Discord 알림 연동
- [ ] 토큰 히스토리 관리

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
