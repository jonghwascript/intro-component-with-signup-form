# Research: 인트로 컴포넌트 & 무료 체험 가입 폼

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-11-24

Technical Context에 NEEDS CLARIFICATION 항목은 없었다. 아래는 기술 선택마다 내린 결정과 근거다.

---

## R1. 기술 스택

- **Decision**: 빌드 도구 없는 HTML + CSS + 바닐라 JavaScript.
- **Rationale**: 화면 1개, 상호작용은 폼 검증뿐이다. 원본 과제가 HTML/CSS/JS 기초 수준을 전제하고, 저장소에 이미 `index.html`이 루트에 있다. 의존성이 없으면 GitHub Pages 같은 정적 호스팅에 그대로 올릴 수 있다.
- **Alternatives considered**:
  - React/Vue 등 프레임워크 — 상태가 필드 4개뿐이라 과하다. 빌드 단계와 번들 크기만 늘어난다.
  - Sass/SCSS — 중첩과 변수는 편하지만 CSS 사용자 정의 속성과 기본 CSS로 충분하고, 컴파일 단계가 생긴다.
  - Tailwind — 클래스가 길어지고 CDN 또는 빌드가 필요하다. 토큰 수가 적어 이점이 작다.

## R2. 폼 검증 방식

- **Decision**: `<form novalidate>`로 브라우저 기본 검증 말풍선을 끄고, 제출 이벤트에서 직접 만든 검증 함수를 실행한다. 입력 타입(`type="email"`, `type="password"`)과 `required`, `autocomplete`는 의미와 모바일 키보드를 위해 그대로 둔다.
- **Rationale**: spec이 정확한 문구("First Name cannot be empty", "Looks like this is not an email")와 Figma 오류 스타일을 요구한다. 브라우저 기본 말풍선은 문구와 모양이 브라우저마다 달라 이 요구를 맞출 수 없다.
- **Alternatives considered**:
  - Constraint Validation API + `setCustomValidity()` — 문구는 바꿀 수 있지만 말풍선 표시 위치·모양은 제어할 수 없다.
  - 입력 중 실시간 검증 — spec Assumptions에서 범위 밖으로 정했다.

**이메일 규칙**: `^[^\s@]+@[^\s@]+\.[^\s@]+$` (앞뒤 공백 제거 후 적용). `name@host.tld` 구조만 확인한다. `email@example/com`, `name@host`는 실패, `name@host.tld`는 통과.

**검사 순서**: 필드별로 빈 값 검사 → (이메일만) 형식 검사. 빈 값이면 형식 메시지는 내지 않는다(spec Edge Cases).

## R3. 스크립트 로딩과 테스트 가능성

- **Decision**: `js/validation.js`는 순수 함수만 담고, 끝에서 `module.exports`가 있으면 CommonJS로, 없으면 `window.SignupValidation`으로 노출한다. HTML에서는 `<script defer>` 두 개(`validation.js` → `main.js`)로 불러온다. 테스트는 `node --test "tests/*.test.js"`.
- **Rationale**: `file://`로 열면 브라우저가 ES 모듈 로딩을 CORS로 막는다. 과제 사용자는 흔히 파일을 더블클릭해 연다. 클래식 스크립트면 어디서 열어도 동작하고, 같은 파일을 Node에서 `require`해 테스트할 수 있다. Node 22가 설치되어 있어 테스트 의존성이 0개다.
- **Alternatives considered**:
  - ES 모듈 + 로컬 서버 필수 — 실행 절차가 하나 늘어난다.
  - Jest/Vitest — `package.json`과 수십 MB 의존성이 필요하다. 테스트 대상이 함수 하나라 과하다.
  - Playwright E2E — 반응형 스크린샷 자동화에는 좋지만 이번 범위에서는 quickstart 수동 확인으로 충분하다. 회귀가 잦아지면 추가를 고려한다.

## R4. 반응형 브레이크포인트

- **Decision**: 모바일 우선. 기본(0–1023px)은 한 열, `@media (min-width: 64rem)`(1024px)부터 두 열.
  - 기본: 좌우 여백 24px, 콘텐츠 최대 폭 540px 가운데 정렬, 소개 텍스트 가운데 정렬, 제목 28px(Text Preset 2).
  - 64rem 이상: 그리드 `1fr minmax(0, 540px)`, 열 간격 48px, 컨테이너 최대 폭 1113px, 두 열 세로 중앙 정렬, 소개 왼쪽 정렬, 제목 50px(Text Preset 1).
- **Rationale**: Figma Tablet(768)은 한 열이고 Desktop(1440)은 두 열이다(소개 525 + 간격 48 + 폼 540 = 1113). 1024px에서 두 열로 바꾸면 소개 열에 약 390px 이상이 남아 50px 제목이 3줄 안에 들어간다. 768–1023px에서는 두 열이 너무 좁다. `rem` 단위를 써서 사용자가 글자 크기를 키우면 전환 지점도 함께 늘어난다.
- **Alternatives considered**: 768px 전환 — 소개 열이 200px 남짓으로 좁아져 Figma Tablet과도 어긋난다. 1440px 전환 — 1024–1439px 노트북에서 한 열이 너무 길게 늘어진다.

## R5. 디자인 토큰

Figma 변수(`get_variable_defs`)에서 가져온 값. `:root`에 사용자 정의 속성으로 정의한다.

**색상**

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-red-400` | `#ff7979` | 페이지 배경, 오류 테두리·문구·아이콘, 약관 링크 |
| `--color-green-400` | `#38cc8b` | 제출 버튼 기본 |
| `--color-green-300` | `#77e2b3` | 제출 버튼 hover |
| `--color-purple-700` | `#5e54a4` | 체험 배너 배경, 입력 포커스 테두리 |
| `--color-purple-400` | `#a6a1cf` | 보조(필요 시) |
| `--color-purple-350` | `#bab7d4` | 약관 안내 문구 |
| `--color-gray-900` | `#3d3b48` | 입력값·플레이스홀더 글자 |
| `--color-gray-200` | `#dedede` | 입력 기본 테두리 |
| `--color-white` | `#ffffff` | 카드 배경, 제목·본문 글자 |
| `--color-black` | `#000000` | 카드·배너 그림자(투명도 적용) |

**간격**: `--space-0: 0`, `--space-100: 8px`, `--space-200: 16px`, `--space-300: 24px`, `--space-400: 32px`, `--space-500: 40px`, `--space-600: 48px`, `--space-800: 64px`. (style-guide의 4px 단계도 필요하면 `--space-50: 4px`)

**글꼴 프리셋** (모두 Poppins)

| 프리셋 | 굵기 | 크기 / 줄 높이 / 자간 | 용도 |
|---|---|---|---|
| Text Preset 1 | 700 | 50px / 110% / -0.5px | 데스크톱 제목 |
| Text Preset 2 | 700 | 28px / 130% / -0.3px | 모바일·태블릿 제목 |
| Text Preset 3 | 500 | 16px / 165% / 0 | 소개 설명 문단 |
| Text Preset 4 Regular | 400 | 15px / 175% / 0.25px | 배너 문구, 입력값 |
| Text Preset 4 SemiBold | 600 | 15px / 175% / 2px | 제출 버튼(대문자) |
| Text Preset 5 Medium Italic | 500 italic | 11px / 155% / 0 | 오류 메시지 |

약관 안내 문구(11px Medium, 링크 Bold)와 배너 강조(Bold)는 프리셋 굵기만 바꿔 쓴다. 정확한 패딩·모서리 반경·그림자 오프셋은 구현 단계에서 Figma `get_design_context`로 노드별로 확인한다.

## R6. 배경 이미지와 그림자

- **Decision**: `body`에 `background-color: var(--color-red-400)`와 `bg-intro-mobile.png`를 깔고, 64rem 이상에서 `bg-intro-desktop.png`로 바꾼다. 배너와 카드는 `border-radius: 10px`, `box-shadow: 0 8px 0 rgba(0,0,0,0.15)` 계열의 아래쪽 단단한 그림자(정확한 값은 구현 시 Figma에서 확인).
- **Rationale**: 저장소 `images/`에 두 배경이 준비되어 있고 Figma Mobile/Desktop 프레임과 같은 패턴이다. 이미지가 늦게 불러와져도 배경색으로 대비가 유지된다.
- **Alternatives considered**: `<picture>`로 마크업에 배경을 넣는 방식 — 장식 이미지라 CSS 배경이 맞다.

## R7. 명암 대비: SC-006과 디자인 충실도의 충돌

Figma 팔레트로 계산한 WCAG 대비(상대 휘도 기준):

| 글자 / 배경 | 대비 | AA 본문(4.5:1) | AA 큰 글자(3:1) |
|---|---|---|---|
| 흰색 / Red 400 `#ff7979` (제목·설명) | 약 2.5:1 | 불통과 | 불통과 |
| 흰색 / Green 400 `#38cc8b` (버튼) | 약 2.1:1 | 불통과 | 불통과 |
| Red 400 / 흰색 (오류 메시지) | 약 2.5:1 | 불통과 | 불통과 |
| Purple 350 `#bab7d4` / 흰색 (약관 문구) | 약 2.0:1 | 불통과 | 불통과 |
| 흰색 / Purple 700 `#5e54a4` (배너) | 약 6.4:1 | 통과 | 통과 |
| Gray 900 `#3d3b48` / 흰색 (입력값) | 약 11:1 | 통과 | 통과 |

- **Decision**: Figma 색을 그대로 쓴다(SC-003 디자인 충실도 우선). SC-006은 이 팔레트로는 달성할 수 없는 알려진 예외로 기록한다. 대신 색에만 의존하지 않도록 보완한다: 오류는 아이콘 + 문구 + `aria-invalid`로 함께 알리고, 포커스는 테두리 두께로도 구분한다.
- **Rationale**: 이 과제의 1차 목표가 디자인 재현이고, 팔레트를 바꾸면 Figma와 육안 비교(SC-003)에서 바로 어긋난다.
- **Alternatives considered**: AA를 맞추도록 색을 어둡게 조정 — 접근성은 좋아지지만 디자인과 달라진다. 사용자가 이쪽을 원하면 `/speckit-clarify`로 SC-006/SC-003 우선순위를 정해야 한다.

## R8. 접근성 구현 패턴

- **Decision**:
  - 입력마다 시각적으로 숨긴 `<label for>`(플레이스홀더는 레이블을 대신하지 못함).
  - 오류 메시지 `<p id="{field}-error">`를 미리 두고, 오류일 때 문구를 채우고 입력에 `aria-invalid="true"`, `aria-describedby="{field}-error"`를 건다.
  - 제출 실패 시 첫 번째 잘못된 필드로 포커스를 옮긴다(화면 낭독기가 해당 레이블과 오류를 읽음).
  - 오류 아이콘은 CSS 배경 이미지로 넣어 장식으로 처리(정보는 문구가 전달).
  - 포커스는 `:focus-visible`로 Purple 700 테두리. 기본 outline을 지우면 반드시 대체 표시를 둔다.
- **Rationale**: FR-011, FR-020, SC-005를 충족하는 가장 단순하고 널리 지원되는 패턴이다.
- **Alternatives considered**: `aria-live` 영역에 오류 요약 — 필드가 4개뿐이라 포커스 이동으로 충분하다.

## R9. 글꼴 로딩

- **Decision**: Google Fonts에서 `Poppins:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap`를 `<link rel="preconnect">`와 함께 불러온다. 대체 글꼴은 `sans-serif`.
- **Rationale**: 필요한 굵기만 받아 용량을 줄이고, `display=swap`으로 글꼴이 늦어도 텍스트가 바로 보인다.
- **Alternatives considered**: 글꼴 파일 직접 호스팅 — 오프라인 동작에 유리하지만 파일 관리가 늘어난다. 외부 요청을 금지해야 한다면 그때 전환한다.
