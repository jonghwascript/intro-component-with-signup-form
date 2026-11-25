# Quickstart: 실행과 검증

**Feature**: [spec.md](./spec.md) | **Contracts**: [ui-contract](./contracts/ui-contract.md), [validation-contract](./contracts/validation-contract.md)

## 준비물

- 최신 Chrome 또는 Edge (DevTools 기기 모드, Lighthouse 사용)
- Node.js 18 이상 (현재 환경 v22) — 단위 테스트용
- Figma 파일의 `✨ Designs` 페이지(Mobile / Tablet / Desktop / Desktop - Active States) — 비교 기준

## 실행

```powershell
# 방법 1: 파일 직접 열기 (빌드 없음)
start index.html

# 방법 2: 로컬 서버 (선택)
npx --yes serve .
```

## 1. 단위 테스트 — 검증 로직

```powershell
node --test "tests/*.test.js"
```

**기대 결과**: [validation-contract의 예시 표](./contracts/validation-contract.md#계약-예시-단위-테스트-기준) 7개 경우가 모두 통과(`# fail 0`).

## 2. 가입 흐름 (US1, US2)

| # | 동작 | 기대 결과 | 관련 |
|---|---|---|---|
| 2-1 | 페이지를 연다 | 제목, 설명, 배너, 플레이스홀더가 있는 필드 4개, 버튼, 약관 문구가 보인다 | FR-001~004 |
| 2-2 | 아무것도 입력하지 않고 버튼 클릭 | 4개 필드 모두 빨간 테두리 + 아이콘, 아래에 "… cannot be empty" 4개, 플레이스홀더 숨김, First Name에 포커스 | FR-007, FR-009 |
| 2-3 | 이메일에 `email@example/com`, 나머지 유효 값 입력 후 제출 | 이메일만 오류, 입력값은 빨간 글자로 유지, "Looks like this is not an email" | FR-008, FR-010 |
| 2-4 | 이메일을 `name@host.tld`로 고치고 제출 | 모든 오류가 사라지고 폼이 비워짐 | FR-012, FR-013 |
| 2-5 | First Name에 공백만 입력 후 제출 | "First Name cannot be empty" | Edge case |
| 2-6 | Password에 입력 | 글자가 가려짐 | FR-005 |
| 2-7 | 버튼을 빠르게 여러 번 클릭 | 오류 문구가 중복되지 않음 | Edge case |

## 3. 반응형 (US3)

DevTools 기기 모드에서 폭을 바꾸며 Figma 프레임과 나란히 비교한다.

| 폭 | 비교 대상 | 확인 사항 |
|---|---|---|
| 375px | Figma `Mobile` | 한 열, 가운데 정렬, 배너 문구 두 줄, 약관 문구 줄바꿈 |
| 768px | Figma `Tablet` | 한 열, 최대 540px 가운데 배치 |
| 1023px → 1024px | — | 이 지점에서 한 열 → 두 열로 전환 |
| 1440px | Figma `Desktop` / `Desktop - Active States` | 두 열, 소개 왼쪽 정렬, 제목 50px |
| 320px, 1920px | — | 가로 스크롤 없음 (SC-004) |

추가: 브라우저 글자 크기를 200%로 키워도 텍스트가 잘리거나 겹치지 않는다.

## 4. 상호작용·접근성 (US4)

| # | 동작 | 기대 결과 |
|---|---|---|
| 4-1 | 버튼에 마우스 올림 | 밝은 녹색 + 포인터 커서 |
| 4-2 | Tab 키로 이동 | 필드 → 버튼 → 약관 링크 순서, 각 요소에 포커스 표시(필드는 보라 테두리) |
| 4-3 | 키보드만으로 2-2 → 2-4 흐름 수행 | 마우스 없이 완료 (SC-005) |
| 4-4 | 화면 낭독기(NVDA 또는 Narrator)로 2-2 후 포커스된 필드 듣기 | 레이블과 오류 문구를 함께 읽음 (FR-011) |
| 4-5 | Lighthouse 접근성 검사 | 명암 대비 항목 외 오류 없음. 명암 대비는 [research R7](./research.md#r7-명암-대비-sc-006과-디자인-충실도의-충돌)의 알려진 예외 |

## 완료 기준

1–4의 모든 항목이 기대 결과와 같고, 단위 테스트가 모두 통과하면 이 기능은 완료로 본다.
