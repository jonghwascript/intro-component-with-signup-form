# Feature Specification: 인트로 컴포넌트 & 무료 체험 가입 폼

**Feature Branch**: `001-intro-signup-form`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "다음 두개의 피그마 URL을 참조해서 요구사항 명세 작성
https://www.figma.com/design/********************

**Design References**:

- `🎨 Design System` 페이지 (node 2-2): Colors, Typography, Spacing 스타일 가이드와 Form 컴포넌트(Default / Active 변형)
- `✨ Designs` 페이지 (node 1-3): Desktop(1440), Tablet(768), Mobile(375) 기본 화면과 Desktop - Active States(오류 상태) 화면

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 서비스 소개를 읽고 무료 체험 가입하기 (Priority: P1)

방문자는 페이지에서 서비스 소개 문구("Learn to code by watching others")와 설명을 읽고, 무료 체험 조건("Try it free 7 days then $20/mo. thereafter")을 확인한 뒤 First Name, Last Name, Email Address, Password를 입력하고 "CLAIM YOUR FREE TRIAL" 버튼을 눌러 가입을 신청한다.

**Why this priority**: 페이지의 존재 목적이 무료 체험 가입 전환이다. 소개 내용 표시와 입력·제출이 없으면 이 기능의 가치가 전혀 없다.

**Independent Test**: 페이지를 열어 소개 문구, 체험 조건 배너, 4개 입력 필드, 제출 버튼, 약관 안내 문구가 모두 보이는지 확인하고, 올바른 값 4개를 입력해 제출했을 때 오류 없이 제출이 받아들여지는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 방문자가 페이지를 처음 열었을 때, **When** 화면을 본다, **Then** 제목 "Learn to code by watching others", 설명 문단, 체험 조건 배너, 입력 필드 4개(First Name / Last Name / Email Address / Password, 각 플레이스홀더 표시), "CLAIM YOUR FREE TRIAL" 버튼, "By clicking the button, you are agreeing to our Terms and Services" 문구가 보인다.
2. **Given** 모든 필드에 유효한 값(예: Jonathan / Doe / name@host.tld / 비어 있지 않은 비밀번호)을 입력했을 때, **When** 제출 버튼을 누른다, **Then** 오류 메시지가 하나도 표시되지 않고 제출이 성공 처리된다.
3. **Given** Password 필드에 값을 입력할 때, **When** 문자를 입력한다, **Then** 입력한 문자는 화면에 그대로 노출되지 않고 가려진다.

---

### User Story 2 - 잘못된 입력에 대한 오류 안내 받기 (Priority: P1)

방문자가 필드를 비워 두거나 이메일 형식을 잘못 입력한 채 제출하면, 어떤 필드가 왜 잘못됐는지 해당 필드 바로 아래에서 안내를 받고 수정할 수 있다.

**Why this priority**: 원본 과제 요구사항의 핵심이며 Figma에 별도의 Active States 화면으로 정의되어 있다. 잘못된 데이터가 제출되는 것을 막고 사용자가 스스로 수정하게 한다.

**Independent Test**: 모든 필드를 비운 채 제출해 4개 필드 모두에 오류 표시가 나타나는지, 이메일에 `email@example/com`을 넣고 제출해 이메일 형식 오류가 나타나는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 모든 필드가 비어 있을 때, **When** 제출 버튼을 누른다, **Then** 각 필드에 오류 상태(빨간 테두리 + 필드 오른쪽 안 오류 아이콘)가 표시되고 필드 아래 오른쪽 정렬로 "First Name cannot be empty", "Last Name cannot be empty", "Email Address cannot be empty", "Password cannot be empty" 메시지가 표시되며, 비어 있는 필드의 플레이스홀더는 숨겨진다.
2. **Given** Email Address에 `email@example/com`처럼 `name@host.tld` 구조가 아닌 값을 입력했을 때, **When** 제출 버튼을 누른다, **Then** 이메일 필드가 오류 상태가 되고 입력값은 오류 색(빨간색)으로 유지되며 "Looks like this is not an email" 메시지가 필드 아래에 표시된다.
3. **Given** 일부 필드만 잘못됐을 때, **When** 제출 버튼을 누른다, **Then** 잘못된 필드에만 오류가 표시되고 올바른 필드는 기본 상태를 유지하며, 제출은 완료되지 않는다.
4. **Given** 오류가 표시된 필드가 있을 때, **When** 사용자가 값을 올바르게 고친 뒤 다시 제출한다, **Then** 고쳐진 필드의 오류 표시와 메시지가 사라진다.

---

### User Story 3 - 기기 크기에 맞는 레이아웃으로 보기 (Priority: P2)

방문자는 휴대폰, 태블릿, 데스크톱 어떤 기기로 접속해도 화면 크기에 맞게 정돈된 레이아웃으로 내용을 읽고 폼을 사용할 수 있다.

**Why this priority**: 가입 전환은 다양한 기기에서 일어난다. 다만 핵심 기능(P1)이 먼저 동작해야 레이아웃 최적화가 의미를 가진다.

**Independent Test**: 화면 너비를 375px, 768px, 1440px로 바꿔 가며 Figma의 Mobile / Tablet / Desktop 프레임과 배치가 일치하는지, 320px에서 가로 스크롤 없이 모든 요소를 사용할 수 있는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 데스크톱 너비(1440px 기준)에서, **When** 페이지를 본다, **Then** 소개 영역(제목·설명, 왼쪽 정렬)이 왼쪽, 체험 배너와 폼 카드가 오른쪽에 나란히 배치되고 두 영역은 세로 중앙에 맞춰진다.
2. **Given** 태블릿 너비(768px 기준)에서, **When** 페이지를 본다, **Then** 소개 영역(가운데 정렬)이 위, 체험 배너와 폼 카드가 아래로 쌓인 한 열 레이아웃이 화면 가운데에 표시된다.
3. **Given** 모바일 너비(375px 기준)에서, **When** 페이지를 본다, **Then** 태블릿과 같은 한 열 순서로 표시되며 좌우 여백 안에서 화면 폭을 채우고, 체험 배너 문구와 약관 문구는 필요 시 두 줄로 줄바꿈된다.
4. **Given** 320px의 가장 좁은 화면에서, **When** 페이지를 본다, **Then** 가로 스크롤 없이 모든 텍스트를 읽고 모든 필드와 버튼을 조작할 수 있다.

---

### User Story 4 - 상호작용 요소의 상태 피드백 받기 (Priority: P3)

방문자는 버튼에 마우스를 올리거나 입력 필드를 선택했을 때 시각적 변화를 보고 현재 어떤 요소와 상호작용 중인지 알 수 있다.

**Why this priority**: 사용성과 완성도를 높이지만, 없어도 가입 자체는 가능하다.

**Independent Test**: 제출 버튼과 "Terms and Services" 링크에 마우스를 올리고, 입력 필드를 클릭·Tab 키로 선택해 상태 변화가 보이는지 확인한다.

**Acceptance Scenarios**:

1. **Given** 제출 버튼이 기본 상태(Green 400 배경)일 때, **When** 마우스를 올린다, **Then** 배경이 더 밝은 녹색(Green 200 계열)으로 바뀌고 포인터 커서가 표시된다.
2. **Given** 입력 필드가 기본 상태(옅은 회색 테두리)일 때, **When** 필드를 클릭하거나 키보드로 이동해 선택한다, **Then** 테두리가 보라색(Purple 700)으로 강조된다.
3. **Given** "Terms and Services" 링크가 있을 때, **When** 마우스를 올리거나 키보드로 선택한다, **Then** 링크임을 알 수 있는 시각적 변화가 나타난다.

---

### Edge Cases

- 필드에 공백 문자만 입력한 경우 → 비어 있는 것으로 간주해 "[Field Name] cannot be empty" 오류를 표시한다.
- 이메일 필드가 비어 있는 경우 → 형식 오류가 아니라 "Email Address cannot be empty"를 표시한다(빈 값 검사가 형식 검사보다 우선).
- 이메일에 `@`는 있으나 최상위 도메인이 없는 값(예: `name@host`) → "Looks like this is not an email"을 표시한다.
- 오류 메시지가 표시돼도 폼 카드 높이가 늘어날 뿐 다른 요소와 겹치거나 잘리지 않아야 한다.
- 사용자가 브라우저 글자 크기를 키운 경우 → 텍스트가 잘리거나 겹치지 않고 레이아웃이 자연스럽게 늘어난다.
- 키보드만으로 모든 필드 입력, 제출, 약관 링크 이동이 가능해야 한다.
- 제출 버튼을 연속으로 여러 번 누른 경우 → 결과(오류 표시 또는 성공 처리)가 중복되거나 깨지지 않는다.

## Requirements *(mandatory)*

### Functional Requirements

**콘텐츠**

- **FR-001**: 페이지는 제목 "Learn to code by watching others"와 설명 "See how experienced developers solve problems in real-time. Watching scripted tutorials is great, but understanding how developers think is invaluable."을 표시해야 한다.
- **FR-002**: 페이지는 폼 위에 "**Try it free 7 days** then $20/mo. thereafter" 배너를 표시해야 하며, "Try it free 7 days"는 굵게 강조되어야 한다.
- **FR-003**: 폼은 First Name, Last Name, Email Address, Password 4개 입력 필드를 이 순서로 제공하고, 각 필드는 해당 이름을 플레이스홀더로 표시해야 한다.
- **FR-004**: 폼은 "CLAIM YOUR FREE TRIAL" 제출 버튼과 그 아래 "By clicking the button, you are agreeing to our Terms and Services" 안내 문구를 표시해야 하며, "Terms and Services"는 강조색(Red 400)의 굵은 링크로 표시되어야 한다.
- **FR-005**: Password 필드의 입력값은 가려져 표시되어야 한다.

**검증 및 오류 표시**

- **FR-006**: 시스템은 제출 시 모든 필드를 검증하고, 하나라도 잘못되면 제출을 완료하지 않아야 한다.
- **FR-007**: 비어 있거나 공백만 있는 필드에 대해 "[Field Name] cannot be empty" 메시지를 표시해야 한다(Field Name은 First Name / Last Name / Email Address / Password).
- **FR-008**: 이메일 값이 비어 있지 않지만 `name@host.tld` 구조가 아니면 "Looks like this is not an email" 메시지를 표시해야 한다.
- **FR-009**: 오류가 있는 필드는 (a) 테두리를 Red 400으로 바꾸고, (b) 필드 안 오른쪽에 오류 아이콘을 표시하고, (c) 필드 바로 아래 오른쪽 정렬로 기울임꼴 Red 400 오류 메시지를 표시하고, (d) 빈 필드의 플레이스홀더를 숨겨야 한다.
- **FR-010**: 형식 오류가 난 이메일 필드는 사용자가 입력한 값을 지우지 않고 Red 400 색으로 유지해야 한다.
- **FR-011**: 오류 메시지는 화면 낭독기 사용자에게도 해당 필드의 오류로 전달되어야 한다.
- **FR-012**: 사용자가 오류를 수정하고 다시 제출하면 수정된 필드의 오류 상태와 메시지는 제거되어야 한다.
- **FR-013**: 모든 필드가 유효하면 제출을 성공으로 처리하고 오류 표시가 없는 상태로 폼을 초기화해야 한다.

**레이아웃 및 상호작용**

- **FR-014**: 데스크톱 너비에서는 소개 영역과 폼 영역이 좌우 두 열로, 태블릿·모바일 너비에서는 소개 영역이 위·폼 영역이 아래인 한 열로 표시되어야 한다.
- **FR-015**: 한 열 레이아웃에서 소개 영역 텍스트는 가운데 정렬, 두 열 레이아웃에서는 왼쪽 정렬이어야 한다.
- **FR-016**: 페이지 배경은 Red 400 위에 디자인 패턴 이미지를 깔고, 데스크톱과 모바일에 각각 맞는 배경 이미지를 사용해야 한다.
- **FR-017**: 체험 배너(Purple 700 배경)와 폼 카드(흰 배경)는 모서리가 둥글고 아래쪽에 짙은 그림자가 있어야 한다.
- **FR-018**: 320px부터 큰 화면까지 가로 스크롤 없이 모든 콘텐츠를 이용할 수 있어야 한다.
- **FR-019**: 제출 버튼은 마우스를 올리면 밝은 녹색으로 바뀌고, 입력 필드는 선택 시 Purple 700 테두리로 강조되어야 한다.
- **FR-020**: 모든 상호작용 요소(필드, 버튼, 링크)는 키보드로 접근 가능하고 선택 상태가 눈에 보여야 한다.

**시각 스타일 (Figma Design System 기준)**

- **FR-021**: 색상은 디자인 시스템 팔레트를 따라야 한다 — Red 400 hsl(0, 100%, 74%), Green 400 hsl(154, 59%, 51%), Purple 700 hsl(248, 32%, 49%), Gray 900 hsl(249, 10%, 26%), Purple 350 hsl(246, 25%, 77%), White.
- **FR-022**: 글꼴은 Poppins(400/500/600/700)를 사용하고 본문 기준 크기는 16px이어야 한다. 제목은 가장 굵은 굵기, 버튼 문구는 대문자와 넓은 자간을 사용해야 한다.
- **FR-023**: 간격은 디자인 시스템 Spacing 척도(4·8·16·24·32·40·48·64px)를 따라야 한다.

### Key Entities

- **가입 신청 (Trial Signup)**: 무료 체험을 신청하는 방문자의 입력. 속성 — First Name(필수), Last Name(필수), Email Address(필수, `name@host.tld` 형식), Password(필수, 가려서 표시).
- **필드 검증 결과 (Field Validation State)**: 각 입력 필드의 상태. 기본 / 선택됨 / 오류 중 하나이며, 오류일 때 해당 메시지("cannot be empty" 또는 "not an email")를 가진다.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 처음 방문한 사용자가 4개 필드를 입력하고 제출을 마치기까지 1분 이내에 완료할 수 있다.
- **SC-002**: 잘못된 입력으로 제출하면 1초 이내에 100%의 잘못된 필드에 대해 올바른 오류 메시지가 표시되고, 올바른 필드에는 오류가 표시되지 않는다.
- **SC-003**: 375px, 768px, 1440px 화면에서 렌더링 결과가 해당 Figma 프레임(Mobile / Tablet / Desktop / Desktop - Active States)과 나란히 비교했을 때 배치·색상·문구가 육안으로 일치한다.
- **SC-004**: 320px부터 1920px까지 모든 화면 폭에서 가로 스크롤이 발생하지 않는다.
- **SC-005**: 마우스 없이 키보드만으로 가입 흐름(입력 → 제출 → 오류 확인 → 수정 → 재제출)을 100% 완료할 수 있다.
- **SC-006**: 본문 텍스트와 배경의 명암 대비가 WCAG 2.1 AA 기준을 충족한다(배경 이미지 위 흰 텍스트 포함).

## Assumptions

- 이 기능은 프런트엔드 화면 범위이다. 실제 계정 생성, 결제, 비밀번호 저장 같은 서버 처리는 범위 밖이며, "제출 성공"은 화면에서 검증을 통과해 폼이 초기화되는 것으로 정의한다.
- Figma에 성공 화면이 정의되어 있지 않으므로 별도의 성공 메시지·페이지는 만들지 않는다.
- 비밀번호는 비어 있지 않은지만 검사한다(최소 길이, 복잡도 규칙 없음 — Figma와 원본 과제에 정의되지 않음).
- 이메일 형식은 `name@host.tld` 구조(이름@호스트.최상위도메인)만 확인하며, 실제 존재 여부는 확인하지 않는다.
- "Terms and Services" 링크의 이동 대상 페이지는 제공되지 않으므로 자리표시 링크로 둔다.
- 검증은 제출 시점에 실행한다. 입력 중 실시간 검증은 Figma에 정의되지 않아 범위 밖이다.
- 기준 화면 폭은 Mobile 375px, Tablet 768px, Desktop 1440px이며, 그 사이 폭은 가까운 레이아웃을 자연스럽게 확장·축소해 사용한다. 두 열 전환 지점은 계획 단계에서 정한다.
- 필요한 이미지 자산(데스크톱·모바일 배경, 오류 아이콘, 파비콘)은 저장소의 `images/` 폴더에 이미 있다.
