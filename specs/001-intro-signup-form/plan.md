# Implementation Plan: 인트로 컴포넌트 & 무료 체험 가입 폼

**Branch**: `001-intro-signup-form` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-intro-signup-form/spec.md`

## Summary

소개 문구, 무료 체험 배너, 4개 필드 가입 폼으로 이루어진 단일 정적 페이지를 Figma(Design System 2-2, Designs 1-3)와 똑같이 구현한다. 375 / 768 / 1440 기준 폭에 반응형으로 맞추고, 제출할 때 빈 값과 이메일 형식을 검증해 Figma Active States와 같은 오류 상태를 표시한다.

기술 방식은 빌드 도구 없이 **HTML + CSS + 바닐라 JavaScript**로 간다. 디자인 토큰은 CSS 사용자 정의 속성으로 옮기고, 검증 로직은 DOM과 분리된 순수 함수 모듈로 만들어 Node 내장 테스트 러너로 검증한다. 화면 결과는 quickstart 시나리오에 따라 세 기준 폭에서 Figma와 나란히 비교해 확인한다.

## Technical Context

**Language/Version**: HTML5, CSS3(사용자 정의 속성, Flexbox/Grid, `clamp()`), JavaScript ES2020(브라우저 클래식 스크립트, 트랜스파일 없음)

**Primary Dependencies**: 런타임 의존성 없음. Google Fonts의 Poppins(400/500/600/700, Medium Italic 500)만 외부에서 불러온다

**Storage**: N/A (입력값은 서버로 보내거나 저장하지 않음, spec Assumptions)

**Testing**: 검증 로직 단위 테스트는 Node 22 내장 `node --test`(의존성 0개). UI·반응형·접근성은 [quickstart.md](./quickstart.md)의 수동 시나리오(브라우저 DevTools 기기 모드 + 키보드 + Lighthouse 접근성)로 확인

**Target Platform**: 최신 에버그린 브라우저(Chrome, Edge, Firefox, Safari 최신 2개 버전), 폭 320px 이상. `index.html`을 파일로 직접 열어도 동작해야 함

**Project Type**: 정적 단일 페이지 웹 컴포넌트(Frontend Mentor 과제)

**Performance Goals**: 제출 후 오류 표시 1초 이내(SC-002, 실제로는 즉시). 페이지 총 크기 1MB 미만(배경 PNG 포함)

**Constraints**: 빌드 단계 없음. 320–1920px에서 가로 스크롤 없음(SC-004). 키보드만으로 전체 흐름 가능(SC-005). 오류 메시지는 spec 문구와 글자 하나까지 같아야 함

**Scale/Scope**: 화면 1개, 폼 1개, 필드 4개, 레이아웃 3종(mobile / tablet / desktop)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md`는 아직 채워지지 않은 템플릿이라 비준된 원칙이 없다. 따라서 검사할 게이트가 없고 **PASS(해당 없음)**로 처리한다. 대신 이 계획은 다음 기본 원칙을 스스로 지킨다.

| 자체 기준 | 계획에서의 반영 | 결과 |
|---|---|---|
| 단순함(YAGNI) | 프레임워크·번들러·패키지 없이 파일 4개 | PASS |
| 테스트 가능성 | 검증 로직을 순수 함수로 분리해 단위 테스트 | PASS |
| 디자인 충실도 | 모든 색·글꼴·간격 값을 Figma 변수에서 가져와 토큰화 | PASS |
| 접근성 | label 연결, `aria-invalid`/`aria-describedby`, 포커스 표시 | PASS(단, research R7의 명암 대비 예외 참고) |

**Post-design 재검사 (Phase 1 이후)**: 설계 산출물이 위 기준을 그대로 유지하므로 PASS. 헌법이 나중에 비준되면 이 섹션을 다시 평가해야 한다.

## Project Structure

### Documentation (this feature)

```text
specs/001-intro-signup-form/
├── plan.md              # 이 파일
├── research.md          # Phase 0: 기술 결정과 근거
├── data-model.md        # Phase 1: 가입 신청·필드 상태 모델, 상태 전이
├── quickstart.md        # Phase 1: 실행·검증 시나리오
├── contracts/
│   ├── ui-contract.md          # 마크업 구조, 접근성 속성, 시각 상태 계약
│   └── validation-contract.md  # 검증 함수 입력/출력 계약
├── checklists/
│   └── requirements.md  # /speckit-specify 산출물
└── tasks.md             # Phase 2 (/speckit-tasks에서 생성)
```

### Source Code (repository root)

```text
index.html               # 기존 파일을 시맨틱 마크업으로 교체 (진입점)
css/
└── style.css            # 디자인 토큰(:root), 기본 스타일, 레이아웃, 컴포넌트, 상태
js/
├── validation.js        # 순수 검증 함수 (브라우저 전역 + Node CommonJS 양쪽 노출)
└── main.js              # DOM 연결: submit 처리, 오류 상태 적용/해제, 폼 초기화
tests/
└── validation.test.js   # node --test 단위 테스트
images/                  # 기존 자산 그대로 사용 (bg-intro-desktop/mobile.png, icon-error.svg, favicon)
```

**Structure Decision**: 저장소 루트의 기존 `index.html`과 `images/`를 그대로 살리는 단일 정적 프로젝트 구조를 택한다. 스타일은 파일 하나(`css/style.css`)로 충분한 규모이고, JS는 테스트 가능성을 위해 순수 로직(`validation.js`)과 DOM 연결(`main.js`)만 나눈다. 파일로 직접 열어도 되도록 ES 모듈 대신 클래식 `<script defer>`를 쓴다(research R3).

## Phase Overview

| Phase | 산출물 | 상태 |
|---|---|---|
| 0. Research | [research.md](./research.md) | 완료 — NEEDS CLARIFICATION 없음 |
| 1. Design & Contracts | [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md) | 완료 |
| 2. Tasks | `tasks.md` | `/speckit-tasks`에서 생성 |

## Implementation Approach (요약)

1. **토큰**: Figma 변수 → `:root` 사용자 정의 속성(색 10개, 간격 8단계, 글꼴 프리셋 6종). 값은 [research.md R5](./research.md#r5-디자인-토큰)에 정리.
2. **마크업**: `<main>` 안에 소개 `<section>`과 가입 `<section>`(배너 `<p>` + `<form novalidate>`). 각 입력에는 시각적으로 숨긴 `<label>`과 오류 메시지 `<p>`를 둔다([ui-contract](./contracts/ui-contract.md)).
3. **레이아웃**: 모바일 우선. 기본은 한 열 가운데 정렬(최대 폭 540px). `min-width: 64rem`(1024px)부터 두 열 그리드(소개 1fr / 폼 최대 540px, 간격 48px)로 바꾸고 소개는 왼쪽 정렬, 제목은 50px로 키운다.
4. **배경**: Red 400 배경색 + 기본 `bg-intro-mobile.png`, 64rem 이상에서 `bg-intro-desktop.png`.
5. **검증**: 제출하면 `validateSignup()` 결과에 따라 필드마다 `aria-invalid`와 오류 메시지를 넣거나 지운다. 오류가 있으면 첫 번째 잘못된 필드로 포커스를 옮기고, 모두 맞으면 `form.reset()`.
6. **상태 스타일**: `:hover`(버튼 Green 300), `:focus-visible`(Purple 700 테두리), `[aria-invalid="true"]`(Red 400 테두리 + 아이콘 + 플레이스홀더 숨김).

## Risks & Open Items

- **명암 대비(SC-006)**: Figma 팔레트 그대로면 여러 텍스트가 WCAG AA를 통과하지 못한다(흰 글자/Red 400 약 2.5:1, 흰 글자/Green 400 약 2.1:1 등). 이 계획은 디자인 충실도(SC-003)를 우선하고 SC-006은 알려진 예외로 기록한다. 결정을 바꾸려면 `/speckit-clarify`로 spec의 SC-006을 고쳐야 한다. 자세한 수치는 [research.md R7](./research.md#r7-명암-대비-sc-006과-디자인-충실도의-충돌).
- **두 열 전환 지점**: Figma에는 768과 1440 사이 화면이 없다. 1024px을 택했고, 근거는 research R4.

## Complexity Tracking

헌법 위반 사항이 없어 해당 없음.
