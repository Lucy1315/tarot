# 타로카드 웹앱 설계 문서

## 개요

canee.kr/tarot의 카드 뽑기 로직을 차용하여 AI 해석 기능을 포함한 타로카드 웹앱을 개발한다.

## 요구사항 요약

- 78장 풀 덱 (메이저 + 마이너 아르카나) 라이더-웨이트 이미지
- 20가지 스프레드 지원
- 카드 선택 방식: 자동셔플, 수동선택
- 역방향(리버스) 토글 지원
- OpenAI API를 통한 AI 타로 해석 (스트리밍)
- 한국어 전용
- 계정/데이터 저장 없음 (일회성)
- 깔끔한 모던/미니멀 디자인

## 기술 스택

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **OpenAI SDK** (`openai` 패키지)
- 상태 관리: React 내장 (useState/useContext)

## 아키텍처

```
┌─────────────────────────────────────┐
│           Next.js App               │
├──────────────┬──────────────────────┤
│  Pages/UI    │   API Routes         │
│              │                      │
│  /           │  /api/reading        │
│  /spread/[type] │  (OpenAI 프록시)  │
│              │                      │
├──────────────┴──────────────────────┤
│           Shared                    │
│  - 78장 카드 데이터 (TS)             │
│  - 20개 스프레드 정의 (TS)           │
│  - 셔플/뽑기 로직 (utils)           │
└─────────────────────────────────────┘
```

## 페이지 흐름

1. **홈 (`/`)** — 20개 스프레드 목록에서 선택
2. **리딩 (`/spread/[type]`)** — 질문 입력, 역방향 토글, 선택 방식(자동/수동) 설정 → 카드 뽑기 → 결과 표시 + AI 해석 스트리밍

> 기존 `/result` 별도 라우트를 제거하고 `/spread/[type]` 내에서 단계별 상태 전환으로 처리한다.
> 계정/저장 없는 일회성 앱이므로 페이지 간 상태 전달 문제를 원천 제거한다.

### 페이지 내 상태 흐름 (`/spread/[type]`)

```
[setup] → [picking] → [result]
```

- **setup**: 질문 입력, 역방향 토글, 선택 방식 선택
- **picking**: 자동셔플 애니메이션 또는 수동 카드 선택
- **result**: 스프레드 레이아웃 + AI 해석 스트리밍 + "다시 뽑기" 버튼 (setup으로 복귀)

상태 관리: `useState<"setup" | "picking" | "result">`로 단계 전환

## 데이터 모델

### 카드 (78장)

```typescript
interface Card {
  id: number;          // 0~77
  name: string;        // "바보", "마법사", "완드 에이스" 등
  nameEn: string;      // "The Fool", "The Magician" 등 (AI 해석용)
  arcana: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  number: number;      // 메이저: 0~21, 마이너: 1~14
  image: string;       // 이미지 경로
}
```

### 스프레드 (20개)

```typescript
interface Spread {
  id: string;           // "one-card", "celtic-cross" 등
  name: string;         // "원 카드", "켈틱 크로스"
  cardCount: number;    // 필요한 카드 수
  positions: {
    index: number;
    label: string;      // "현재 상황", "장애물" 등
    x: number;          // 레이아웃 좌표 (%)
    y: number;
    rotation?: number;  // 켈틱크로스 가로 카드 등
  }[];
}
```

### 뽑은 카드

```typescript
interface DrawnCard {
  card: Card;
  position: number;     // 스프레드 내 위치
  reversed: boolean;    // 역방향 여부
}
```

## 스프레드 목록

| # | ID | 이름 | 카드 수 |
|---|----|------|---------|
| 1 | one-card | 원 카드 | 1 |
| 2 | two-cards | 2카드 | 2 |
| 3 | three-cards | 3카드 | 3 |
| 4 | four-cards | 4카드 | 4 |
| 5 | five-cards | 5카드 | 5 |
| 6 | double-line-6 | 더블 라인 6 | 6 |
| 7 | double-line-7 | 더블 라인 7 | 7 |
| 8 | double-line-8 | 더블 라인 8 | 8 |
| 9 | double-line-9 | 더블 라인 9 | 9 |
| 10 | celtic-cross | 켈틱 크로스 | 10 |
| 11 | mini-celtic | 미니 켈틱 크로스 | 6 |
| 12 | cross | 십자 | 5 |
| 13 | horseshoe | 말발굽 | 5 |
| 14 | magic-seven | 매직 세븐 | 7 |
| 15 | pyramid | 피라미드 | 6 |
| 16 | alternative | 양자택일 | 5 |
| 17 | tandem | 탄뎀 | 6 |
| 18 | relationship | 릴레이션십 | 7 |
| 19 | cup-of-relationship | 컵 오브 릴레이션십 | 8 |
| 20 | yin-yang | 음양 | 6 |

> 참고: 호로스코프(13장), 1년 운세(12+장), 리딩 마인드 등은 canee.kr 사이트의 상세 분석 후 카드 수와 레이아웃을 정확히 반영하여 조정한다.

### 스프레드 레이아웃 좌표 전략

각 스프레드의 `positions` (x, y, rotation) 정의 방법:

1. **기본 패턴 재사용**: 대부분의 스프레드는 아래 기본 패턴 조합으로 구성
   - **가로 일렬**: 카드 수에 따라 균등 배분 (1~5카드, 더블라인 상/하단)
   - **십자형**: 중앙 + 상하좌우 (켈틱크로스 코어, 십자, 말발굽)
   - **세로 열**: 우측 4장 세로 배치 (켈틱크로스)
   - **피라미드**: 삼각형 배치 (1-2-3 또는 3-2-1)
   - **대칭 분기**: 좌우 대칭 (양자택일, 릴레이션십)

2. **좌표계**: 퍼센트 기반 (`x: 0~100`, `y: 0~100`), 카드 크기는 CSS로 별도 관리
3. **구현 순서**: 원카드 → 3카드 → 켈틱크로스 순으로 구현하며, 이후 패턴을 재활용하여 나머지 스프레드 확장

## 카드 이미지

- 소스: 1909년 원본 라이더-웨이트-스미스(Rider-Waite-Smith) 덱
- 라이선스: **퍼블릭 도메인** (미국 저작권 만료, 1909년 출판)
- 주의: US Games Systems 재채색 버전(1971)은 저작권 보호 대상이므로 사용 불가
- 이미지 포맷: WebP, 카드당 약 300x527px (모바일 최적화)
- 경로: `public/cards/{id}.webp` (0.webp ~ 77.webp)

## 핵심 로직

### 셔플 & 카드 뽑기

- `crypto.getRandomValues()` 사용 (암호학적 랜덤)
- 역방향 활성화 시 각 카드별 50% 확률로 리버스

```typescript
// 자동셔플: 78장 셔플 후 앞에서 n장 추출
function autoShuffle(cardCount: number, allowReversed: boolean): DrawnCard[]

// 수동선택: 사용자가 선택한 카드 ID 배열을 DrawnCard로 변환
function manualPick(selectedIds: number[], allowReversed: boolean): DrawnCard[]
```

### AI 해석 API (`/api/reading`)

```
POST /api/reading
Body: {
  question: string,
  spread: string,
  cards: {
    position: string,
    name: string,
    reversed: boolean
  }[]
}
Response: ReadableStream (스트리밍 텍스트)
```

- OpenAI API에 스프레드 유형, 포지션별 카드, 질문을 포함한 프롬프트 전송
- 스트리밍 응답으로 실시간 해석 표시
- 프롬프트: 타로 전문가 역할 부여, 각 포지션별 해석 → 종합 해석 구조

### 에러 처리

| 상황 | 처리 |
|------|------|
| `OPENAI_API_KEY` 미설정 | API 라우트에서 500 + JSON `{ error: "API 키가 설정되지 않았습니다" }`, UI에 안내 메시지 표시 |
| API 할당량 초과 (429) | `"일시적으로 해석 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요."` |
| 네트워크 오류 / 스트리밍 중단 | 수신된 텍스트까지 유지 + `"해석이 중단되었습니다."` 메시지 + "다시 시도" 버튼 |
| 잘못된 스프레드 type 접근 | 홈(`/`)으로 리다이렉트 |

## UI/UX 상세

### 홈 페이지 (`/`)
- 상단: 앱 타이틀 + 간단한 설명
- 카테고리별 스프레드 그리드
- 각 스프레드에 이름 + 카드 수 표시
- 흰색 배경 + 그레이/블랙 톤 미니멀 스타일

### 딜러 페이지 (`/spread/[type]`)
- 스프레드 이름 + 설명
- 질문 입력 텍스트필드 (선택사항)
- 역방향 ON/OFF 토글 스위치
- 선택 방식 탭: 자동셔플 | 수동선택
  - 자동: "셔플" 버튼 → 카드 뽑기 애니메이션 → 결과
  - 수동: 78장 뒷면 그리드 → 클릭으로 n장 선택 → 결과
    - 선택한 카드: 테두리 하이라이트 + 선택 순서 번호 표시
    - 선택 순서 = 스프레드 포지션 순서 (1번째 클릭 → 포지션 1)
    - 선택 취소: 선택된 카드 재클릭으로 취소 가능 (이후 순서 번호 자동 재정렬)
    - 필요 카드 수 충족 시 "결과 보기" 버튼 활성화

### 결과 단계 (리딩 페이지 내)
- 상단: 스프레드 레이아웃에 카드 배치 (포지션 라벨 포함)
- 리버스 카드 180도 회전 표시
- 하단: AI 해석 영역 (스트리밍 실시간 표시)
- "다시 뽑기" 버튼 → setup 단계로 복귀

### 반응형
- 모바일 우선 설계
- 스프레드 레이아웃 뷰포트 맞춤 스케일링
- 수동선택 그리드 가로 스크롤

### 스타일링
- Tailwind CSS
- 카드 뒤집기, 셔플 등 CSS 애니메이션

## 프로젝트 구조

```
tarot/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── spread/
│   │   └── [type]/
│   │       └── page.tsx
│   └── api/
│       └── reading/
│           └── route.ts
├── components/
│   ├── CardBack.tsx
│   ├── CardFace.tsx
│   ├── SpreadLayout.tsx
│   ├── ManualPicker.tsx
│   ├── ReadingStream.tsx
│   └── SpreadCard.tsx
├── data/
│   ├── cards.ts
│   └── spreads.ts
├── lib/
│   ├── shuffle.ts
│   ├── openai.ts
│   └── prompt.ts
├── public/
│   └── cards/
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 환경 변수

```
OPENAI_API_KEY=sk-...
```
