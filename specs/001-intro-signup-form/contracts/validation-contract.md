# Contract: 검증 모듈 (`js/validation.js`)

DOM에 의존하지 않는 순수 함수. 브라우저에서는 `window.SignupValidation`, Node에서는 `require('../js/validation.js')`로 같은 객체를 얻는다.

## `validateSignup(values) → ValidationResult`

**입력** `values`: `{ firstName: string, lastName: string, email: string, password: string }`
- 누락된 키나 `null`/`undefined`는 빈 문자열로 취급한다.

**출력**:

```text
{
  isValid: boolean,
  errors: {
    [fieldKey]?: { code: "empty" | "invalidEmail", message: string }
  }
}
```

**규칙**
1. 각 값은 앞뒤 공백을 제거한 뒤 검사한다.
2. 빈 값이면 `code: "empty"`, `message: "{Field Name} cannot be empty"`.
3. `email`이 비어 있지 않고 `^[^\s@]+@[^\s@]+\.[^\s@]+$`에 맞지 않으면 `code: "invalidEmail"`, `message: "Looks like this is not an email"`.
4. `errors`의 키 순서는 `firstName → lastName → email → password`.
5. 오류가 없으면 `{ isValid: true, errors: {} }`.

## `isValidEmail(value) → boolean`

규칙 3의 정규식 판정만 수행(앞뒤 공백 제거 후).

## `FIELD_LABELS`

`{ firstName: "First Name", lastName: "Last Name", email: "Email Address", password: "Password" }` — 메시지 생성과 UI 레이블이 같은 출처를 쓰도록 노출한다.

## 계약 예시 (단위 테스트 기준)

| 입력 | 기대 결과 |
|---|---|
| 모두 빈 문자열 | `isValid: false`, 4개 필드 모두 `empty`, 문구 4종 정확히 일치 |
| `email: "email@example/com"`, 나머지 유효 | `errors.email.code === "invalidEmail"`만 존재 |
| `email: "name@host"` | `invalidEmail` |
| `email: "  name@host.tld  "` | 유효 |
| `firstName: "   "` | `empty` |
| `email: ""` | `empty` (형식 오류 아님) |
| 모두 유효 (`Jonathan`, `Doe`, `name@host.tld`, `secret`) | `{ isValid: true, errors: {} }` |
