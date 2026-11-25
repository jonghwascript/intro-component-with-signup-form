# Project Constitution: React & HTML/CSS

## 1. Core Principles (불변 설계 원칙)
- **Semantic HTML First**: `<div>`와 `<span>` 남용을 엄격히 금지하며, 의미에 맞는 표준 HTML5 태그(`<button>`, `<nav>`, `<main>`, `<article>`, `<header>` 등)를 최우선 사용한다 (MUST).
- **Component Single Responsibility**: 하나의 컴포넌트는 하나의 UI 역할만 담당하며, 150줄을 초과할 경우 하위 컴포넌트 또는 커스텀 훅으로 분리한다 (SHOULD).
- **Pure Functions & Immutability**: React 상태는 절대 직접 변조(Mutate)하지 않으며, 사이드 이펙트는 `useEffect` 및 이벤트 핸들러 내부로 격리한다 (MUST).
- **Scope Discipline**: 작업 요청에 없는 글로벌 CSS 리셋 수정이나 다른 컴포넌트의 마크업/스타일 변경을 금지한다 (MUST NOT).

---

## 2. Styling & CSS Architecture (스타일링 규약)
- **Styling Method**:
  - CSS Modules(`[Component].module.css`) 또는 BEM 네이밍 규칙을 준수한 전용 CSS 파일을 사용한다 (MUST).
  - 인라인 스타일(`style={{ ... }}`)은 동적으로 계산되는 값(좌표, 진행률 등)을 제외하고 사용을 금지한다 (MUST NOT).
- **No Unapproved Frameworks**:
  - 명시적 지시가 없는 한 Tailwind CSS, Bootstrap, MUI 등 외부 CSS/UI 프레임워크를 임의로 설치하거나 도입하지 않는다 (MUST NOT).
- **Design Tokens**:
  - 색상, 폰트 크기, 간격, 브레이크포인트는 `:root`에 정의된 CSS 커스텀 속성(CSS 변수)을 참조한다 (MUST).
- **Responsive & Units**:
  - 반응형 구현 시 Mobile-First 미디어 쿼리를 기본으로 작성한다 (SHOULD).
  - 고정 픽셀(`px`)의 과도한 사용을 지양하고, 폰트 및 여백에는 상대 단위(`rem`, `em`, `%`)를 적극 활용한다 (SHOULD).

---

## 3. React Component Standards (컴포넌트 개발 표준)
- **Component Paradigm**:
  - 모든 컴포넌트는 함수형 컴포넌트(`Function Component`)와 React Hooks로 작성한다 (MUST).
  - 클래스형 컴포넌트(`class Component`) 작성은 레거시 마이그레이션 외에는 금지한다 (MUST NOT).
- **Props & Types**:
  - 컴포넌트 상단에서 Props는 반드시 구조 분해 할당(Destructuring)으로 명시한다 (MUST).
  - Props 드릴링(3단계 이상)이 발생할 경우 상태 끌어올리기, 합성(Composition) 또는 React Context API를 검토한다.
- **List Rendering**:
  - `map()` 순회 시 `key` 속성에 배열 인덱스(`index`)를 단독 사용하는 것을 금지한다 (MUST NOT). 데이터의 고유 식별자(`id`)를 할당해야 한다 (MUST).
- **Direct DOM Manipulation**:
  - `document.querySelector`나 `document.getElementById` 등 브라우저 DOM API를 직접 호출하지 않는다 (MUST NOT). DOM 접근이 필수적인 경우 `useRef`를 통해서만 제어한다 (MUST).

---

## 4. Accessibility & Web Standards (접근성 및 표준)
- **Interactive Elements**:
  - 클릭 가능한 요소는 반드시 `<button>` 또는 `<a>`로 작성한다. `<div onClick>` 형태의 구현은 금지한다 (MUST NOT).
  - 클릭 이벤트가 있는 비대화형 요소 부득이 사용 시 `role="button"`, `tabIndex={0}`, 키보드 핸들러(`onKeyDown`)를 필수 구현한다 (MUST).
- **Images & Media**:
  - 모든 `<img>` 태그는 의미 있는 `alt` 속성을 포함해야 한다 (MUST). 장식용 이미지일 경우 빈 값(`alt=""`)을 명시한다.
- **Form Controls**:
  - 모든 `<input>`, `<select>`, `<textarea>`는 연관된 `<label>` 태그와 `htmlFor`/`id`로 매핑되어야 한다 (MUST).

---

## 5. Testing & Quality Gate (완료 기준)
- **Lint & Build**:
  - 브라우저 콘솔에 경고(Warning: React Hook dependency missing, Unique key warning 등)가 단 하나도 없어야 한다 (MUST).
  - 린트(`npm run lint`) 및 빌드(`npm run build`)가 오류 없이 통과해야 한다 (MUST).
- **Component Verification**:
  - 컴포넌트 렌더링 및 주요 사용자 이벤트(클릭, 입력, 폼 제출)에 대한 테스트(React Testing Library 등)를 작성하여 통과시킨다 (SHOULD).

---

## 6. AI Agent Guardrails (에이전트 행동 지침)
- **No Unsafe HTML**: XSS 취약점을 유발하는 `dangerouslySetInnerHTML`의 임의 사용을 엄격히 금지한다 (MUST NOT).
- **Folder Convention**: 컴포넌트 추가 시 아래 단일 폴더 구조 원칙을 유지한다 (MUST).
  ```text
  src/
  └── components/
      └── [ComponentName]/
          ├── [ComponentName].jsx (또는 .tsx)
          ├── [ComponentName].module.css
          └── [ComponentName].test.jsx