# Onboarding Test Cases

## Manual Test Plan

### 1. Initial Load
```
Given: Fresh browser session (localStorage cleared)
When: User opens digital-truth.html
Then: 
  ✓ Splash screen displays
  ✓ Header shows "Digital Truth: Идентификация агента"
  ✓ "Начать идентификацию" button is clickable
  ✓ No game content is visible
```

### 2. Splash Screen Navigation
```
Given: User is on splash screen
When: User clicks "Начать идентификацию"
Then:
  ✓ Welcome screen displays
  ✓ 3 bullet points visible
  ✓ "Заполнить паспортичку" button is clickable
```

### 3. Welcome Screen Back Navigation
```
Given: User is on welcome screen
When: User clicks navigation (or skips to form directly)
When: User clicks "Заполнить паспортичку"
Then:
  ✓ Form screen displays (Step 2/3)
  ✓ All 10 form fields are visible
  ✓ Progress indicator shows "Шаг 2 из 3"
```

### 4. Form Field Validation - Callsign
```
Given: User is on form screen
When: User tries to submit without entering callsign
Then:
  ✓ "Далее" button is disabled
  
When: User enters "Agent Nova"
Then:
  ✓ Callsign field accepts input (max 32 chars)
  ✓ Help text shows: "Это ваш публичный ник..."

When: User deletes callsign
Then:
  ✓ "Далее" button becomes disabled again
```

### 5. Form Field Validation - Gender (Radio)
```
Given: User is on form screen
When: User doesn't select gender
Then:
  ✓ "Далее" button is disabled

When: User selects "Женский"
Then:
  ✓ Radio is checked
  ✓ "Далее" button remains disabled (pending other fields)

When: User selects "Другое"
Then:
  ✓ Text input field appears below "Другое" option
  ✓ User can type custom gender value

When: User switches to "Мужской"
Then:
  ✓ Text input field disappears
  ✓ Custom value is cleared
```

### 6. Form Field Validation - Age (Radio)
```
Given: User is on form screen
When: User doesn't select age
Then:
  ✓ "Далее" button is disabled

When: User selects "26-35"
Then:
  ✓ Radio is checked
  ✓ Validation progresses
```

### 7. Form Field Validation - Region (Dropdown)
```
Given: User is on form screen
When: Region dropdown shows default "—"
Then:
  ✓ "Далее" button is disabled

When: User opens dropdown
Then:
  ✓ All 10 options visible: Russia, Ukraine, Belarus, etc.

When: User selects "russia"
Then:
  ✓ Dropdown shows "Россия"
  ✓ Help text (if any) does not interfere

When: All required fields filled (callsign, gender, age, region)
Then:
  ✓ "Далее" button becomes ENABLED
```

### 8. Form Back Navigation
```
Given: User is on form screen
When: User clicks "Назад"
Then:
  ✓ Welcome screen displays
  ✓ Form data is NOT preserved (fresh form on re-entry)
```

### 9. Form Submission
```
Given: User filled all required fields:
  - Callsign: "Agent Zenith"
  - Gender: "male"
  - Age: "36-45"
  - Region: "russia"
When: User clicks "Далее"
Then:
  ✓ Consent screen displays (Step 3/3)
  ✓ Summary shows:
    - Позывной: Agent Zenith
    - Пол: Мужской
    - Возраст: 36–45
    - Регион: Россия
```

### 10. Consent Screen - Privacy Info
```
Given: User is on consent screen
When: User sees summary grid
Then:
  ✓ 4 fields displayed in 2x2 grid
  ✓ Labels are muted color, values are bright

When: User sees privacy explanation
Then:
  ✓ "О данных простыми словами:" section visible
  ✓ Text explains data is anonymous
  ✓ Green accent bar on left

When: User clicks "Подробнее о защите данных"
Then:
  ✓ Modal popup displays (dark overlay)
  ✓ Modal title: "Как мы обрабатываем ваши данные"
  ✓ 7 sections visible (Who, What, Why, Legal, Storage, etc.)
  ✓ Contact email: support@digitaltruth.game
```

### 11. Modal Navigation
```
Given: Privacy modal is open
When: User clicks "Понял"
Then:
  ✓ Modal closes
  ✓ User back on consent screen
  ✓ Consent checkboxes still unchecked

When: User clicks "×" button
Then:
  ✓ Modal closes

When: User clicks outside modal (on overlay)
Then:
  ✓ Modal closes
```

### 12. Consent Checkboxes
```
Given: User is on consent screen
When: Both checkboxes unchecked
Then:
  ✓ "Активировать профиль агента" button is DISABLED

When: User checks only consent data
Then:
  ✓ Button remains DISABLED

When: User checks only age confirmation
Then:
  ✓ Button remains DISABLED

When: User checks BOTH checkboxes
Then:
  ✓ "Активировать профиль агента" button becomes ENABLED

When: User unchecks one checkbox
Then:
  ✓ Button becomes DISABLED again
```

### 13. Form Back from Consent
```
Given: User is on consent screen with data filled
When: User clicks "Назад"
Then:
  ✓ Form screen displays
  ✓ All previous form inputs are preserved:
    - Callsign: "Agent Zenith"
    - Gender: "male" is still selected
    - Age: "36-45" is still selected
    - Region: "russia" is still selected
```

### 14. Onboarding Completion
```
Given: User on consent screen with both checkboxes checked
When: User clicks "Активировать профиль агента"
Then:
  ✓ Toast notification appears:
    "Идентификация завершена. Добро пожаловать в миссию, Agent Zenith!"
  ✓ Toast auto-disappears after ~2 seconds
  ✓ Game start screen displays
  ✓ "Ты — детектив фактов" screen visible
  ✓ Game data shows: Репутация: 0, Дело — 0 / 5
```

### 15. Data Persistence
```
Given: User completed onboarding with callsign "Agent Zenith"
When: User opens DevTools → Application → Local Storage
Then:
  ✓ Key "agentData" exists
  ✓ Value contains:
    {
      "callsign": "Agent Zenith",
      "gender": "male",
      "age": "36-45",
      "region": "russia",
      "completedAt": "2025-11-09T..."
    }

When: User refreshes page
Then:
  ✓ Game start screen displays immediately (skips onboarding)
  ✓ No splash/form screens shown
```

### 16. New Session Persistence
```
Given: User completed onboarding before
When: User closes all browser tabs completely
When: User opens browser again and navigates to digital-truth.html
Then:
  ✓ Game start screen displays (localStorage data persists)
  ✓ Onboarding is NOT shown again
```

### 17. Clear Data Reset
```
Given: User has completed onboarding
When: Developer runs: localStorage.removeItem('agentData')
When: User refreshes page
Then:
  ✓ Splash screen displays
  ✓ Onboarding flow starts from beginning
```

### 18. Mobile Responsiveness (375px width)
```
Given: User opens on mobile device (iPhone SE size)
When: Viewing splash screen
Then:
  ✓ Text is readable without horizontal scroll
  ✓ Button is full width (16px padding on sides)
  ✓ Badge fits on one line or wraps gracefully

When: Viewing form screen
Then:
  ✓ All inputs are full width
  ✓ Radio options stack vertically (not horizontal)
  ✓ Text inputs have touch-friendly padding (40px+ height)
  ✓ Dropdown expands properly

When: Viewing consent screen
Then:
  ✓ Summary grid shows 1 column (not 2x2)
  ✓ Privacy modal fits in viewport
  ✓ Checkboxes are touchable (not too small)
```

### 19. Tablet Responsiveness (800px width)
```
Given: User opens on tablet
When: Viewing form screen
Then:
  ✓ Form fields may display in 2-column grid (if designed)
  ✓ Layout is readable and not cramped

When: Viewing consent screen
Then:
  ✓ Summary grid shows 2x2 layout
  ✓ Modal width is constrained (not full screen)
```

### 20. Keyboard Navigation
```
Given: User on form screen
When: User presses Tab
Then:
  ✓ Focus moves to next form field (visible focus outline)
  ✓ Focus order: callsign → gender radios → age radios → region dropdown → next section

When: User is on radio buttons and presses Arrow keys
Then:
  ✓ Arrow Up/Down switches between radio options
  ✓ Selection changes immediately

When: User is on checkbox and presses Space
Then:
  ✓ Checkbox toggles on/off

When: User is on button and presses Enter
Then:
  ✓ Button action triggers (form submission, navigation, etc.)
```

### 21. Accessibility - Screen Reader
```
Given: User with screen reader enabled
When: Screen reader encounters form
Then:
  ✓ Labels are announced for all inputs
  ✓ Required fields are announced as "required"
  ✓ Help text is associated with input
  ✓ Radio groups are announced as groups
  ✓ Dropdown options are readable

When: Screen reader encounters modal
Then:
  ✓ Modal is announced as dialog
  ✓ Focus is trapped within modal (doesn't read background)
```

### 22. Form Field Validation - Optional Fields
```
Given: User fills only required fields:
  - Callsign: "Agent Lite"
  - Gender: "female"
  - Age: "18-25"
  - Region: "ukraine"
  
When: User clicks "Далее"
Then:
  ✓ All optional fields empty (Education, Activity, Platform, etc.)
  ✓ Form proceeds to consent screen
  ✓ No validation error for optional fields
  ✓ Summary shows only required fields
```

### 23. Optional Fields Population
```
Given: User on form screen
When: User selects optional fields:
  - Education: "bachelor"
  - Activity: "2-5h"
  - Platform: "tiktok"
  - Factcheck: "always"
  - Role: "creator"
  - Goal: "research"
  
When: User submits form
Then:
  ✓ All optional data is saved to localStorage
  ✓ Can be used for analytics/research later
```

### 24. Error States - Network (Future)
```
Given: Onboarding integrated with backend
When: User clicks "Активировать" and server fails
Then:
  ✓ Toast error: "Регистрация не удалась. Попробуй ещё раз."
  ✓ User remains on consent screen
  ✓ Data is NOT cleared
  ✓ User can retry
```

### 25. Performance - Page Load
```
Given: User opens digital-truth.html
When: Page loads
Then:
  ✓ Splash screen visible within 1 second
  ✓ No layout shift / Cumulative Layout Shift < 0.1
  ✓ All buttons clickable within 2 seconds
  ✓ No console errors
```

---

## Automated Test Examples (Jest/Vitest)

```javascript
// onboarding.test.js
import OnboardingComponents from '../onboarding-components.js';

describe('Onboarding Validation', () => {
  test('Valid agent data passes validation', () => {
    const data = {
      callsign: 'Agent Nova',
      gender: 'female',
      age: '26-35',
      region: 'russia'
    };
    const result = OnboardingComponents.validate(data);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('Missing callsign fails validation', () => {
    const data = {
      gender: 'female',
      age: '26-35',
      region: 'russia'
    };
    const result = OnboardingComponents.validate(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('callsign: required');
  });

  test('Missing gender fails validation', () => {
    const data = {
      callsign: 'Agent Nova',
      age: '26-35',
      region: 'russia'
    };
    const result = OnboardingComponents.validate(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('gender: required');
  });

  test('All required fields missing', () => {
    const result = OnboardingComponents.validate({});
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(4); // 4 required fields
  });
});

describe('Data Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Save and load agent data', () => {
    const agent = {
      callsign: 'Agent Zero',
      gender: 'male',
      age: '36-45',
      region: 'belarus'
    };
    
    OnboardingComponents.saveToStorage(agent);
    const loaded = OnboardingComponents.loadFromStorage();
    
    expect(loaded.callsign).toBe('Agent Zero');
    expect(loaded.gender).toBe('male');
    expect(loaded.completedAt).toBeDefined();
  });

  test('Load returns null when no data saved', () => {
    const loaded = OnboardingComponents.loadFromStorage();
    expect(loaded).toBeNull();
  });

  test('Clear storage removes data', () => {
    const agent = { callsign: 'Agent Test' };
    OnboardingComponents.saveToStorage(agent);
    expect(OnboardingComponents.loadFromStorage()).not.toBeNull();
    
    OnboardingComponents.clearStorage();
    expect(OnboardingComponents.loadFromStorage()).toBeNull();
  });
});

describe('Localization', () => {
  test('Gender labels are correct', () => {
    expect(OnboardingComponents.GENDER_LABELS.female).toBe('Женский');
    expect(OnboardingComponents.GENDER_LABELS.male).toBe('Мужской');
    expect(OnboardingComponents.GENDER_LABELS.nonbinary).toBe('Небинарный');
  });

  test('Age labels format correctly', () => {
    expect(OnboardingComponents.AGE_LABELS['26-35']).toBe('26–35');
    expect(OnboardingComponents.AGE_LABELS['46plus']).toBe('46+');
  });

  test('Success message formats callsign', () => {
    const msg = OnboardingComponents.SUCCESS_MESSAGE('Agent Phoenix');
    expect(msg).toContain('Agent Phoenix');
    expect(msg).toContain('Идентификация завершена');
  });
});
```

---

## Regression Testing

After any code changes, verify:

1. ✓ Splash screen displays correctly
2. ✓ All 4 screens navigate properly
3. ✓ Form validation works (required fields)
4. ✓ Optional fields don't block submission
5. ✓ Consent checkboxes both required
6. ✓ Privacy modal opens/closes
7. ✓ Data saves to localStorage
8. ✓ Refresh skips onboarding if completed
9. ✓ Mobile responsive (375px, 768px, 1024px)
10. ✓ No console errors
11. ✓ No broken links or missing elements
12. ✓ Keyboard navigation works
13. ✓ Focus states visible
14. ✓ Toast messages display correctly
15. ✓ Game board loads after completion

---

## Smoke Test (Quick 5-min Check)

```
1. Open digital-truth.html
2. Fill form: Agent Test / Female / 26-35 / Russia
3. Click through to consent
4. Check both boxes
5. Click "Активировать"
6. Verify game board loads with correct callsign in header
7. Refresh page
8. Verify game board loads immediately (no splash screen)
9. Open DevTools → Storage → Clear localStorage
10. Refresh page
11. Verify splash screen displays again

✓ All 11 steps = onboarding working correctly
```

