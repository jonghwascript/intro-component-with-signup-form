# Contract: UI 구조와 상태 (`index.html` + `css/style.css` + `js/main.js`)

화면 낭독기, 키보드 사용자, 그리고 검증 스크립트가 의존하는 마크업 약속. 클래스 이름은 구현에서 바꿔도 되지만 **아래 요소, id, 속성, 문구는 유지**한다.

## 문서 구조

```text
<main>
  <section aria-labelledby="intro-title">          소개 영역
    <h1 id="intro-title">Learn to code by watching others</h1>
    <p>See how experienced developers solve problems in real-time. …</p>
  </section>
  <section aria-label="Free trial sign up">        가입 영역
    <p><strong>Try it free 7 days</strong> then $20/mo. thereafter</p>
    <form id="signup-form" novalidate>
      <div id="form-status" class="visually-hidden" role="status" aria-live="polite" aria-atomic="true"></div>   화면 낭독기 전용 오류 요약 / 성공 메시지
      (필드 4개 — 아래 표)
      <button type="submit">Claim your free trial</button>   ← CSS로 대문자 표시
      <p>By clicking the button, you are agreeing to our <a href="#">Terms and Services</a></p>
    </form>
  </section>
</main>
<footer class="attribution">…</footer>          (기존 Frontend Mentor 표기 유지)
```

## 필드

| id / name | type | autocomplete | label(시각적 숨김) · placeholder | 오류 요소 id |
|---|---|---|---|---|
| `firstName` | `text` | `given-name` | First Name | `firstName-error` |
| `lastName` | `text` | `family-name` | Last Name | `lastName-error` |
| `email` | `email` | `email` | Email Address | `email-error` |
| `password` | `password` | `new-password` | Password | `password-error` |

각 필드 묶음:

```text
<div class="field">
  <label for="{id}" class="visually-hidden">{Field Name}</label>
  <input id="{id}" name="{id}" type="…" placeholder="{Field Name}" required>
  <p id="{id}-error" class="field__error"></p>
</div>
```

## 상태 계약

| 상태 | DOM 표시 | 시각 결과 (Figma 기준) |
|---|---|---|
| 기본 | `aria-invalid` 없음, 오류 `<p>` 비어 있음 | 1px Gray 200 테두리, 모서리 둥글게, 플레이스홀더 Gray 900 약 75% 불투명 |
| 포커스 | `:focus-visible` | 테두리 Purple 700 |
| 오류 | `aria-invalid="true"`, `aria-describedby="{id}-error"`, 오류 `<p>`에 문구 | 테두리 Red 400, 입력 오른쪽 안 `icon-error.svg`, 플레이스홀더 숨김, 입력값 글자 Red 400(이메일), 아래 오른쪽 정렬 11px Medium Italic Red 400 문구 |
| 버튼 hover | `:hover` | 배경 Green 400 → Green 300, `cursor: pointer` |
| 오류 요약 | `#form-status`에 오류 개수 문구 + 필드별 오류 문구 목록(텍스트만, 포커스 받는 요소 없음) | 화면에 보이지 않음(시안 유지) |
| 성공 | `#form-status`에 성공 문구 | 화면에 보이지 않음(시안 유지) |
| 링크 | `a:hover`, `a:focus-visible` | 밑줄 또는 불투명도 변화 + 포커스 테두리 |

## 동작 계약 (`main.js`)

1. `submit` 이벤트에서 기본 동작을 막고 4개 값을 모아 `SignupValidation.validateSignup()` 호출.
2. 결과에 따라 각 필드에 오류를 적용하거나 해제(문구, `aria-invalid`, `aria-describedby`).
3. 무효가 있으면 `#form-status`에 오류 요약(개수 + 필드별 오류 문구 목록)을 그리고, 첫 무효 필드에 `focus()`.
4. 모두 유효하면 `form.reset()` 후 모든 오류 표시 제거, `#form-status`에 "Thanks! Your free trial has been claimed." 표시. 이후 첫 필드로 포커스.
5. 연속 제출에도 같은 결과가 나와야 한다(상태를 누적하지 않고 매번 필드와 `#form-status`를 비운 뒤 전체를 다시 그림).

## 레이아웃 계약

| 폭 | 배치 | 소개 정렬 | 제목 프리셋 | 배경 이미지 |
|---|---|---|---|---|
| 0 – 1023px | 한 열(소개 → 배너 → 카드), 좌우 24px, 최대 540px 가운데 | 가운데 | Text Preset 2 (28px) | `bg-intro-mobile.png` |
| 1024px 이상 | 두 열(소개 \| 배너+카드), 간격 48px, 최대 1113px, 세로 중앙 | 왼쪽 | Text Preset 1 (50px) | `bg-intro-desktop.png` |
