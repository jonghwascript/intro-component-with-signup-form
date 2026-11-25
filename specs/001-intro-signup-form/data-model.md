# Data Model: 인트로 컴포넌트 & 무료 체험 가입 폼

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

데이터는 브라우저 메모리에만 존재하며 저장하거나 전송하지 않는다.

## Entity: TrialSignup (가입 신청)

| 필드 키 | 표시 이름 (Field Name) | 입력 종류 | 필수 | 검증 규칙 |
|---|---|---|---|---|
| `firstName` | First Name | 텍스트 | 예 | 앞뒤 공백 제거 후 비어 있지 않음 |
| `lastName` | Last Name | 텍스트 | 예 | 앞뒤 공백 제거 후 비어 있지 않음 |
| `email` | Email Address | 이메일 | 예 | 비어 있지 않음 → `^[^\s@]+@[^\s@]+\.[^\s@]+$` 일치 |
| `password` | Password | 비밀번호(가림) | 예 | 비어 있지 않음(공백만 있으면 빈 값으로 간주). 길이·복잡도 규칙 없음 |

필드 순서는 위 표 순서로 고정한다(FR-003). 오류 시 포커스 이동 순서도 같다.

## Entity: FieldValidationState (필드 검증 상태)

| 속성 | 타입 | 설명 |
|---|---|---|
| `field` | `firstName \| lastName \| email \| password` | 대상 필드 |
| `status` | `default \| focused \| invalid` | 시각 상태 |
| `errorCode` | `empty \| invalidEmail \| null` | 오류 종류 |
| `message` | string \| null | 표시할 문구 |

**메시지 매핑**

| errorCode | 메시지 |
|---|---|
| `empty` | `"{Field Name} cannot be empty"` (예: `"Email Address cannot be empty"`) |
| `invalidEmail` | `"Looks like this is not an email"` |

## 상태 전이

```text
           focus              blur
 default ─────────▶ focused ─────────▶ default
    ▲                                    │
    │ 다시 제출 시 유효                    │ 제출 시 무효
    │                                    ▼
    └──────────────────────────────── invalid
                (invalid 상태에서도 focus 시 포커스 표시는 함께 보인다)
```

- `invalid`는 **제출할 때만** 들어가고 나온다. 입력 중에는 오류를 지우거나 새로 띄우지 않는다(spec Assumptions: 제출 시점 검증).
- 제출 결과 모든 필드가 유효하면: 모든 필드 `default`, 폼 값 초기화(FR-013).
- 제출 결과 하나라도 무효면: 무효 필드는 `invalid`, 유효 필드는 `default`, 첫 무효 필드로 포커스(FR-006, FR-012).

## 폼 수준 결과: ValidationResult

| 속성 | 타입 | 설명 |
|---|---|---|
| `isValid` | boolean | 모든 필드가 유효하면 `true` |
| `errors` | `Partial<Record<fieldKey, {code, message}>>` | 무효 필드만 포함, 필드 순서 유지 |

함수 계약은 [contracts/validation-contract.md](./contracts/validation-contract.md) 참고.
