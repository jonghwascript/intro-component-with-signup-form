---

description: "Task list for 인트로 컴포넌트 & 무료 체험 가입 폼"
---

# Tasks: 인트로 컴포넌트 & 무료 체험 가입 폼

**Input**: Design documents from `/specs/001-intro-signup-form/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: 검증 로직 단위 테스트(`tests/validation.test.js`)는 plan.md의 Testing 항목과 [validation-contract](./contracts/validation-contract.md#계약-예시-단위-테스트-기준)에 정의되어 있어 포함한다(US2). UI는 [quickstart.md](./quickstart.md) 수동 시나리오로 검증한다.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4, spec.md 기준)
- 경로는 저장소 루트 기준 (plan.md Project Structure: `index.html`, `css/`, `js/`, `tests/`, `images/`)

## Figma 참조 노드 (fileKey `********************`)

| 화면 | node id | 용도 |
|---|---|---|
| Desktop | `66139:4375` | 두 열 레이아웃, 기본 상태 |
| Tablet | `40139:133` | 한 열 768px |
| Mobile | `66139:2` | 한 열 375px |
| Desktop - Active States | `66139:2887` | 오류 상태, 버튼 hover |
| Form 컴포넌트 Default / Active | `66146:244` / `66146:243` | 필드·버튼·카드 세부 치수 |

정확한 패딩·모서리 반경·그림자 값이 필요한 작업은 해당 노드에서 Figma `get_design_context`로 확인한다(사전에 `figma:figma-design-to-code` 스킬 로드).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 파일 구조와 문서 head 준비

- [X] T001 plan.md Project Structure대로 `css/style.css`, `js/validation.js`, `js/main.js`, `tests/validation.test.js` 빈 파일을 만든다 (기존 `index.html`, `images/`는 유지)
- [X] T002 `index.html`의 `<head>`를 정리한다: `lang="en"`, charset, viewport, 기존 favicon 유지, 제목 유지, Poppins 로딩(`preconnect` 2개 + `Poppins:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap`, research.md R9), `css/style.css` 링크, 기존 인라인 `<style>`(attribution) 제거 후 style.css로 이전, `</body>` 앞이 아닌 head에 `<script defer src="js/validation.js">` → `<script defer src="js/main.js">` 순서로 추가 (research.md R3)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 스토리가 쓰는 디자인 토큰, 기본 스타일, 문서 뼈대

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 `css/style.css` 맨 위 `:root`에 research.md R5의 토큰을 정의한다 — 색 10개(`--color-red-400` … `--color-black`), 간격(`--space-0` … `--space-800`), 글꼴 패밀리(`--font-family: "Poppins", sans-serif`), 프리셋별 크기·줄높이·자간 변수(Text Preset 1~5)
- [X] T004 `css/style.css`에 기본 스타일을 추가한다: `*,*::before,*::after { box-sizing: border-box }`, 기본 margin 제거, `body`(Poppins, 16px, 흰 글자, `background: var(--color-red-400) url(../images/bg-intro-mobile.png)`, `min-height: 100vh`), `input/button` 글꼴 상속, `.visually-hidden` 유틸리티, `.attribution` 스타일(기존 인라인 스타일 이전) (depends on T003)
- [X] T005 [P] `index.html` `<body>`의 평문을 [ui-contract 문서 구조](./contracts/ui-contract.md#문서-구조)의 뼈대로 교체한다: `<main>` 안에 소개 `<section aria-labelledby="intro-title">`와 가입 `<section aria-label="Free trial sign up">` 빈 컨테이너, 기존 `<footer class="attribution">` 유지

**Checkpoint**: 빈 레이아웃이 빨간 배경 패턴 위에 표시되고 콘솔 오류가 없다

---

## Phase 3: User Story 1 - 서비스 소개를 읽고 무료 체험 가입하기 (Priority: P1) 🎯 MVP

**Goal**: 소개 문구, 체험 배너, 4개 필드 폼, 버튼, 약관 문구가 Figma Mobile 기준 모양으로 보이고, 값을 입력해 제출하면 페이지 이동 없이 제출이 처리된다.

**Independent Test**: quickstart.md 2-1, 2-6을 수행하고, 4개 필드에 값을 넣어 제출했을 때 페이지가 새로 고쳐지지 않고 폼이 비워지는지 확인한다.

### Implementation for User Story 1

- [X] T006 [US1] `index.html` 소개 section에 `<h1 id="intro-title">Learn to code by watching others</h1>`와 설명 `<p>`를 spec FR-001 문구 그대로 넣는다
- [X] T007 [US1] `index.html` 가입 section에 배너 `<p class="trial-banner"><strong>Try it free 7 days</strong> then $20/mo. thereafter</p>`를 넣는다 (FR-002) (depends on T006 — 같은 파일)
- [X] T008 [US1] `index.html`에 `<form id="signup-form" class="signup-card" novalidate>`와 필드 4개를 [ui-contract 필드 표](./contracts/ui-contract.md#필드)대로 만든다 — 필드별 `.field` 래퍼, 시각적 숨김 `<label for>`, `<input>`(id/name/type/autocomplete/placeholder/`required`), 빈 `<p id="{id}-error" class="field__error">`. 필드 순서와 입력 종류는 [data-model.md](./data-model.md) `TrialSignup.firstName`, `TrialSignup.lastName`, `TrialSignup.email`, `TrialSignup.password`를 따른다(`TrialSignup.password`는 `type="password"`로 가림, FR-005) (depends on T007)
- [X] T009 [US1] `index.html` 폼 끝에 `<button type="submit">Claim your free trial</button>`와 `<p class="terms">By clicking the button, you are agreeing to our <a href="#">Terms and Services</a></p>`를 넣는다 (FR-004) (depends on T008)
- [X] T010 [P] [US1] `css/style.css`에 소개 영역 모바일 우선 스타일을 추가한다: 가운데 정렬, `h1` Text Preset 2(700, 28px, 130%, -0.3px), 설명 Text Preset 3(500, 16px, 165%), 제목과 설명 사이 간격은 Figma Mobile `66139:2` 기준
- [X] T011 [US1] `css/style.css`에 `.trial-banner` 스타일을 추가한다: `--color-purple-700` 배경, 흰 글자 가운데 정렬, Text Preset 4 Regular, `strong`은 700, 모서리 둥글게, 아래쪽 단단한 그림자, 패딩 — 값은 Figma Form 컴포넌트 `66146:244`에서 확인 (research.md R6) (depends on T010 — 같은 파일)
- [X] T012 [US1] `css/style.css`에 `.signup-card`와 필드 기본 상태를 추가한다: 흰 배경, 모서리·그림자는 배너와 동일 계열, 내부 패딩, 필드 간 간격; `input`은 1px `--color-gray-200` 테두리, 둥근 모서리, 입력 글꼴은 Text Preset 4 계열(정확한 굵기는 Figma `66146:244`에서 확인), 입력 글자 `--color-gray-900`, `::placeholder`는 `--color-gray-900` 약 75% 불투명; `.field__error`는 비어 있을 때 공간을 차지하지 않음 (ui-contract 상태 계약 "기본") (depends on T011)
- [X] T013 [US1] `css/style.css`에 제출 버튼과 약관 문구 기본 스타일을 추가한다: 버튼 전체 폭, `--color-green-400` 배경, 흰 글자, `text-transform: uppercase`, Text Preset 4 SemiBold(600, 15px, 2px 자간), 아래쪽 짙은 녹색 그림자, 둥근 모서리; `.terms`는 11px Medium `--color-purple-350` 가운데 정렬, 링크는 700 `--color-red-400` 밑줄 없음 (depends on T012)
- [X] T014 [P] [US1] `js/main.js`에 `DOMContentLoaded` 후 `#signup-form`의 `submit` 리스너를 등록해 `preventDefault()`하고 `form.reset()` 후 첫 필드(`#firstName`)로 포커스하는 기본 제출 흐름을 만든다 (US2에서 이 사이에 검증을 끼워 넣을 수 있도록 `handleSubmit` 함수로 분리)

**Checkpoint**: 375px에서 Figma Mobile과 같은 순서·색·문구로 보이고, 제출 시 페이지 이동 없이 폼이 비워진다

---

## Phase 4: User Story 2 - 잘못된 입력에 대한 오류 안내 받기 (Priority: P1)

**Goal**: 제출 시 빈 값·이메일 형식을 검증해 Figma Active States와 같은 오류 상태와 정확한 문구를 표시하고, 유효하면 오류를 지우고 폼을 초기화한다.

**Independent Test**: `node --test "tests/*.test.js"` 통과 + quickstart.md 2-2 ~ 2-5, 2-7 수행.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T015 [P] [US2] `tests/validation.test.js`에 `node:test`와 `node:assert/strict`로 [validation-contract 예시 표](./contracts/validation-contract.md#계약-예시-단위-테스트-기준)의 7개 경우를 테스트로 작성한다(`require('../js/validation.js')`). 메시지 문구는 글자 단위로 비교하고, `errors` 키 순서(`firstName → lastName → email → password`)도 검사한다. `node --test "tests/*.test.js"` 실행 시 실패하는 것을 확인한다

### Implementation for User Story 2

- [X] T016 [P] [US2] `js/validation.js`에 [validation-contract](./contracts/validation-contract.md)대로 `FIELD_LABELS`, `isValidEmail(value)`, `validateSignup(values)`를 구현한다. 필드 규칙은 [data-model.md](./data-model.md) `TrialSignup.firstName`, `TrialSignup.lastName`, `TrialSignup.email`, `TrialSignup.password`, 오류 코드와 문구는 `FieldValidationState.errorCode`, `FieldValidationState.message`를 따른다. 파일 끝에서 `typeof module !== 'undefined' && module.exports`면 CommonJS로, 아니면 `window.SignupValidation`으로 노출한다 (research.md R3). `node --test "tests/*.test.js"`가 모두 통과해야 한다
- [X] T017 [US2] `js/main.js`에 `showFieldError(input, message)`와 `clearFieldError(input)`를 추가한다 — 오류 `<p id="{id}-error">`의 텍스트, `aria-invalid="true"`, `aria-describedby="{id}-error"`를 설정/제거해 [data-model.md](./data-model.md) `FieldValidationState.status`의 `invalid` ↔ `default` 전이를 반영한다 ([ui-contract 상태 계약](./contracts/ui-contract.md#상태-계약)) (depends on T014, T016)
- [X] T018 [US2] `js/main.js`의 `handleSubmit`을 확장한다: 4개 값을 모아 `SignupValidation.validateSignup()` 호출 → 매 제출마다 4개 필드를 모두 다시 그림(오류 필드는 `showFieldError`, 나머지는 `clearFieldError`) → 오류가 있으면 첫 오류 필드에 `focus()`하고 종료, 없으면 모든 오류 제거 후 `form.reset()`과 첫 필드 포커스 ([ui-contract 동작 계약](./contracts/ui-contract.md#동작-계약-mainjs) 1–5) (depends on T017)
- [X] T019 [US2] `css/style.css`에 오류 상태를 추가한다: `input[aria-invalid="true"]`는 `--color-red-400` 테두리, `images/icon-error.svg`를 오른쪽 안쪽에 배경으로(아이콘과 겹치지 않도록 오른쪽 패딩 확보), `::placeholder` 투명, 입력 글자 `--color-red-400`(FR-010); `.field__error`는 오른쪽 정렬 Text Preset 5 Medium Italic(500 italic, 11px, 155%) `--color-red-400`, 위쪽 간격은 Figma `66139:2887` 기준 (FR-009)

**Checkpoint**: 빈 제출 시 4개 오류, `email@example/com` 제출 시 이메일 오류만, 수정 후 재제출 시 오류 해제와 폼 초기화가 된다

---

## Phase 5: User Story 3 - 기기 크기에 맞는 레이아웃으로 보기 (Priority: P2)

**Goal**: 0–1023px 한 열, 1024px 이상 두 열 레이아웃으로 Figma Mobile / Tablet / Desktop 프레임과 일치하고 320px에서도 가로 스크롤이 없다.

**Independent Test**: quickstart.md §3 표의 폭(375, 768, 1023→1024, 1440, 320, 1920)과 글자 크기 200% 확인.

### Implementation for User Story 3

- [X] T020 [US3] `css/style.css`에 한 열 레이아웃 컨테이너를 추가한다: `main` 좌우 패딩 `--space-300`(24px), 위아래 여백은 Figma Mobile `66139:2`(위 88px 근처), 내용 최대 폭 540px 가운데 정렬, 소개와 가입 영역 사이 `--space-800`(64px), 배너와 카드 사이 `--space-300`; Tablet `40139:133`과 비교해 맞춘다 ([ui-contract 레이아웃 계약](./contracts/ui-contract.md#레이아웃-계약) 첫 행)
- [X] T021 [US3] `css/style.css`에 `@media (min-width: 64rem)` 블록을 추가한다: `main`을 `grid-template-columns: 1fr minmax(0, 540px)`, `column-gap: var(--space-600)`, 최대 폭 1113px 가운데, `align-items: center`, `min-height: 100vh`; 소개 왼쪽 정렬, `h1` Text Preset 1(700, 50px, 110%, -0.5px); `body` 배경을 `bg-intro-desktop.png`로 교체 (research.md R4, R6) (depends on T020)
- [X] T022 [US3] `css/style.css`에서 좁은 화면 보호 규칙을 점검·추가한다: 그리드/플렉스 자식 `min-width: 0`, 입력 `width: 100%`, 긴 단어 `overflow-wrap: anywhere`(약관·이메일), 글꼴 크기와 브레이크포인트는 `rem` 사용; 320px과 브라우저 글자 크기 200%에서 가로 스크롤과 잘림이 없는지 확인 (FR-018, SC-004) (depends on T021)

**Checkpoint**: 세 기준 폭에서 Figma와 나란히 비교해 배치가 일치하고, 1024px에서 두 열로 전환된다

---

## Phase 6: User Story 4 - 상호작용 요소의 상태 피드백 받기 (Priority: P3)

**Goal**: 버튼 hover, 입력 포커스, 링크 hover/포커스 상태가 보이고 키보드만으로 전체 흐름이 가능하다.

**Independent Test**: quickstart.md §4의 4-1 ~ 4-4.

### Implementation for User Story 4

- [X] T023 [US4] `css/style.css`에 제출 버튼 상태를 추가한다: `:hover`에 `--color-green-300` 배경, `cursor: pointer`, 짧은 `transition`; `:focus-visible`에 흰 카드 위에서 보이는 outline (Figma `66139:2887` hover 참조)
- [X] T024 [US4] `css/style.css`에 입력 포커스 상태를 추가한다: `input:focus-visible`(및 `:focus`)에 `--color-purple-700` 테두리, 기본 outline은 대체 표시가 있을 때만 제거; 오류 상태에서 포커스해도 포커스 표시가 함께 보이도록 우선순위 확인 (Figma Form `66146:243`의 Jonathan 입력 상태) (depends on T023)
- [X] T025 [US4] `css/style.css`에 약관 링크 상태를 추가한다: `a:hover`/`a:focus-visible`에 밑줄 또는 불투명도 변화 + 포커스 outline (depends on T024)
- [X] T026 [US4] 키보드만으로 Tab 순서(필드 4개 → 버튼 → 약관 링크 → footer 링크)와 quickstart 4-3 흐름을 확인하고, 문제가 있으면 `index.html` 순서를 고친다 (SC-005)

**Checkpoint**: 모든 스토리가 독립적으로 동작한다

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 디자인 충실도 마무리와 전체 검증

- [X] T027 Figma `66139:4375`, `40139:133`, `66139:2`, `66139:2887`을 `get_screenshot`으로 받아 375/768/1440px 화면과 나란히 비교하고, 어긋나는 패딩·모서리·그림자·줄 간격을 `css/style.css`에서 맞춘다 (SC-003)
- [X] T028 [P] `index.html` footer의 "Coded by" 이름과 링크를 사용자 정보로 바꾸거나 자리표시로 남길지 확인하고 정리한다
- [ ] T029 Lighthouse 접근성 검사를 실행해 명암 대비 외 항목의 오류를 `index.html`/`css/style.css`에서 고친다. 명암 대비 경고는 research.md R7의 알려진 예외로 남긴다 (SC-006)
- [X] T030 `css/style.css`에서 쓰이지 않는 토큰·중복 규칙을 정리하고, `js/main.js`에 남은 디버그 코드가 없는지 확인한다
- [ ] T031 [quickstart.md](./quickstart.md) 1–4 전체를 수행하고 결과를 기록한다 (`node --test "tests/*.test.js"` 포함)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 즉시 시작
- **Foundational (Phase 2)**: Setup 완료 후 — 모든 스토리를 막음
- **US1 (Phase 3)**: Foundational 이후. 마크업과 기본 스타일을 만든다
- **US2 (Phase 4)**: T015·T016은 Foundational 직후 US1과 병렬 가능. T017–T019는 US1의 폼 마크업(T008)과 `handleSubmit`(T014)에 의존
- **US3 (Phase 5)**: Foundational 이후 시작 가능하나, 비교 검증은 US1 마크업이 있어야 의미가 있다
- **US4 (Phase 6)**: US1의 버튼·입력·링크 마크업에 의존
- **Polish (Phase 7)**: 원하는 스토리가 모두 끝난 뒤

### User Story Dependencies

```text
Setup → Foundational ─┬─▶ US1 (P1, MVP) ─┬─▶ US2 (P1) 화면 연결부(T017–T019)
                      │                  ├─▶ US3 (P2)
                      │                  └─▶ US4 (P3)
                      └─▶ US2 검증 로직(T015–T016)  ← US1과 병렬 가능
                                              모두 ─▶ Polish
```

### Within Each User Story

- `index.html`, `css/style.css`, `js/main.js`는 각각 한 파일이므로 같은 파일 작업은 순서대로 진행
- US2: 테스트(T015) 먼저 작성해 실패 확인 → 구현(T016)으로 통과

### Parallel Opportunities

- T005(`index.html`)는 T003–T004(`css/style.css`)와 병렬
- US1: T010(CSS), T014(JS)는 HTML 작업 T006–T009와 병렬
- US2: T015(`tests/`)와 T016(`js/validation.js`)은 서로 다른 파일이며 US1 작업과도 병렬
- T028(`index.html` footer)은 다른 Polish 작업과 병렬

---

## Parallel Example: User Story 1

```bash
# Foundational 완료 후 동시에 진행:
Task: "T006–T009 index.html 콘텐츠·폼 마크업 (순서대로)"
Task: "T010 css/style.css 소개 영역 스타일"
Task: "T014 js/main.js 기본 submit 흐름"
```

## Parallel Example: User Story 2

```bash
# US1과 동시에 시작 가능:
Task: "T015 tests/validation.test.js 작성 (실패 확인)"
Task: "T016 js/validation.js 구현 (테스트 통과)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup → Phase 2: Foundational
2. Phase 3: US1 — 콘텐츠와 폼이 보이고 제출 가능
3. **STOP and VALIDATE**: quickstart 2-1, 2-6, 375px 화면 확인

### Incremental Delivery

1. Setup + Foundational → 배경과 뼈대
2. US1 → 모바일 화면과 제출 (MVP)
3. US2 → 오류 검증 (원본 과제 핵심 요구사항 충족)
4. US3 → 태블릿·데스크톱 레이아웃
5. US4 → hover/포커스 상태
6. Polish → Figma 대조 마무리와 전체 검증

US1과 US2는 모두 P1이므로 실제 제출 가능한 결과물은 US2까지 완료한 시점으로 본다.

---

## Notes

- [P] = 다른 파일이고 미완료 작업에 의존하지 않음
- 오류 문구는 spec·validation-contract 문구와 글자 단위로 같아야 한다
- 색·간격·글꼴은 하드코딩하지 말고 T003의 토큰을 사용한다
- 각 Checkpoint에서 멈추고 해당 스토리를 독립적으로 검증한다
