# Digital Truth: Onboarding Implementation

Complete onboarding system for the "Digital Truth" game, including scenario, UI implementation, and platform-specific guides.

## 📦 What's Included

### 1. **digital-truth.html** ✅ Production-Ready
Fully integrated web implementation with:
- 4-screen onboarding flow (Splash → Welcome → Form → Consent)
- Responsive design (mobile & desktop)
- Client-side validation
- localStorage persistence
- Privacy policy modal
- Game integration (players must complete onboarding before playing)

**To run:** Open in any modern browser. First visit shows splash screen; subsequent visits skip to game.

### 2. **onboarding-components.js** 🔧 Reusable Module
Framework-agnostic component library with:
- `AGENT_SCHEMA` — Data validation rules
- `SCREENS` — All UI text/structure
- `validate()` — Input validation function
- `saveToStorage()` / `loadFromStorage()` — Persistence methods
- Localization helpers (gender labels, age labels)

**Usage:** Import in any JavaScript project (Node, browser, etc.)

### 3. **PLATFORM-GUIDES.md** 📚 Implementation Reference
Step-by-step guides for:
- ✅ Web (HTML/CSS/JS) — Complete
- 🎮 Unity (C#) — Architecture + code examples
- 🎮 Godot (GDScript) — Scene structure + implementation
- 🎮 Construct 3 — Event sheet configuration
- 🎮 Defold — Collection structure + Lua code
- ⚛️ React/Next.js — Component patterns + custom hooks
- 📱 Flutter — Provider pattern + screens
- Vue 3, Svelte, and other frameworks can follow React patterns

### 4. **ONBOARDING-REFINEMENTS.md** 🔍 Analysis & Improvements
- Strengths of original scenario
- 10 issues identified + fixes applied
- Accessibility improvements
- Security notes
- Testing checklist
- Recommended next steps

### 5. **COPY-PASTE-EXPORTS.md** 🚀 Quick Start
Ready-to-use code snippets for:
- Web (vanilla JS)
- React/TypeScript
- Vue 3
- Unity C#
- Godot GDScript
- Flutter Dart
- Construct 3 (event sheet syntax)
- Minimal validation & success callbacks

## 🎯 Quick Start

### For Web:
```bash
# Just open the file
open digital-truth.html

# Or use a local server
python -m http.server 8000
# Visit http://localhost:8000/digital-truth.html
```

First-time visitor → Splash screen → 3-step onboarding → Game board

### For Other Platforms:
1. Read `PLATFORM-GUIDES.md` for your framework
2. Copy relevant code from `COPY-PASTE-EXPORTS.md`
3. Adapt to your project structure
4. Use `onboarding-components.js` for shared logic

## 📋 Onboarding Flow

```
[Splash] → [Welcome] → [Form: 10 fields] → [Consent + Privacy] → [Game Start]
   1s         10s         45-60s              20s              (player-driven)
```

### Required Fields (marked with *)
- Callsign (text, max 32 chars)
- Gender (radio: 5 options)
- Age (radio: 5 ranges)
- Region (dropdown: 10 options)

### Optional Fields (research demographics)
- Education, activity level, platform, fact-check habits, role, goal

## 🔐 Data Collected (Anonymized)

```json
{
  "callsign": "Agent Nova",     // Public nickname only
  "gender": "female",            // Demographic
  "age": "26-35",                // Age range (not exact)
  "region": "russia",            // Broad region
  "education": "bachelor",       // Optional
  "activity": "5-8h",            // Optional
  "platform": "instagram",       // Optional
  "factcheck": "sometimes",      // Optional
  "role": "active",              // Optional
  "goal": "challenge",           // Optional
  "completedAt": "2025-11-09..." // Timestamp
}
```

**NO personal data (name, email, phone, IP) is collected.**

## ✨ Features

- ✅ Gamified language ("паспорт агента", "позывной")
- ✅ Progressive disclosure (3 steps, not overwhelming)
- ✅ Clear value prop ("< 1 минуты")
- ✅ Privacy-first (explicit consent, detailed policy)
- ✅ Responsive design (mobile-first)
- ✅ Real-time validation
- ✅ Accessibility (ARIA labels, keyboard nav)
- ✅ localStorage persistence
- ✅ Reusable components
- ✅ Multi-platform ready

## 🧪 Testing

### Manual Testing:
1. Open `digital-truth.html`
2. Fill form with various data combinations
3. Try submitting with incomplete fields (Next button should be disabled)
4. Verify both consent checkboxes are required
5. Open Privacy modal, verify it closes
6. Check localStorage in DevTools (`Application` → `Storage` → `Local Storage`)
7. Refresh page — should skip onboarding and show game

### Unit Tests (if integrating):
```javascript
const OnboardingComponents = require('./onboarding-components.js');

// Valid data should pass
const valid = OnboardingComponents.validate({
  callsign: "Agent Nova",
  gender: "female",
  age: "26-35",
  region: "russia"
});
console.assert(valid.valid === true, "Validation failed");

// Missing field should fail
const invalid = OnboardingComponents.validate({
  callsign: "Agent Nova",
  gender: "female",
  age: "26-35"
  // region missing
});
console.assert(invalid.valid === false, "Should have failed");
```

## 📱 Responsive Breakpoints

- **Mobile**: <640px (full-width inputs, stacked layout)
- **Tablet**: 640-1024px (2-column grid where applicable)
- **Desktop**: >1024px (optimized form layout)

## 🔗 API Integration (Future)

When adding backend:

```javascript
// POST to server after consent
fetch('/api/agent/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(agentData)
})
.then(r => r.json())
.then(data => {
  localStorage.setItem('agentToken', data.token);
  localStorage.setItem('agentData', JSON.stringify(data.profile));
  // Redirect to game
})
.catch(err => toast('Registration failed: ' + err.message));
```

## 🎨 Customization

### Change Color Scheme:
Edit CSS variables in `<style>`:
```css
:root{
  --bg:#0b0f14;           /* Background */
  --card:#0f1621;         /* Card background */
  --ink:#eaf2ff;          /* Text color */
  --acc:#53e2ae;          /* Accent (green) */
  --warn:#ff7a7a;         /* Warning (red) */
}
```

### Change Form Fields:
Edit `onboarding-components.js` `SCREENS.FORM.fields` array, then update HTML form to match.

### Translate to Another Language:
Create new language object in `onboarding-components.js`:
```javascript
OnboardingComponents.LOCALES = {
  ru: { /* current */ },
  en: { /* English translation */ },
  es: { /* Spanish translation */ }
};
```

## 📊 Analytics Integration (Optional)

Track onboarding funnel:
```javascript
// In onboarding JavaScript
analytics.trackEvent('onboarding_started');
analytics.trackEvent('onboarding_splash_viewed');
analytics.trackEvent('onboarding_form_viewed');
analytics.trackEvent('onboarding_form_completed', {
  timeSpent: 45,
  callsign: agentData.callsign,
  gender: agentData.gender
});
analytics.trackEvent('onboarding_consent_viewed');
analytics.trackEvent('onboarding_completed', {
  timestamp: agentData.completedAt
});
```

## 🛡️ Security Considerations

⚠️ **Current implementation is client-side only.** For production:

1. **Validate on server** — Never trust client-side validation
2. **HTTPS only** — Encrypt data in transit
3. **No PII in logs** — Don't log personal information
4. **GDPR ready** — Implement right-to-delete, export
5. **Age verification** — <18 may need parental consent
6. **Rate limiting** — Prevent spam registrations
7. **CAPTCHA** — Optional, for production scale

## 📞 Support

For questions about:
- **Web implementation** → See HTML comments in `digital-truth.html`
- **Component API** → See `onboarding-components.js` documentation
- **Other platforms** → See `PLATFORM-GUIDES.md` for your framework
- **Code snippets** → See `COPY-PASTE-EXPORTS.md`

## 📝 File Reference

| File | Purpose | Size |
|------|---------|------|
| `digital-truth.html` | Full web implementation | 42 KB |
| `onboarding-components.js` | Reusable module | 11 KB |
| `PLATFORM-GUIDES.md` | Implementation guides | 14 KB |
| `ONBOARDING-REFINEMENTS.md` | Analysis & improvements | 11 KB |
| `COPY-PASTE-EXPORTS.md` | Code snippets | 11 KB |
| `README.md` | This file | — |

## 🚀 Deployment Checklist

- [ ] Test onboarding flow end-to-end
- [ ] Verify localStorage persistence
- [ ] Test privacy modal on all screen sizes
- [ ] Check console for errors/warnings
- [ ] Test with screen reader (accessibility)
- [ ] Verify keyboard navigation (Tab, Enter)
- [ ] Test on mobile devices
- [ ] Set up analytics tracking (if needed)
- [ ] Configure backend API (if needed)
- [ ] Document customization in your project

## 📄 License

This onboarding system is provided as-is for the Digital Truth game project.

---

**Version:** 2.0  
**Last Updated:** November 9, 2025  
**Status:** Production Ready ✅
