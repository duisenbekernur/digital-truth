# Digital Truth: Onboarding Platform Integration Guide

Complete implementation guide for integrating the onboarding flow into different platforms.

---

## 1. Web (HTML/CSS/JS)

**Status:** ✅ Complete — `digital-truth.html`

All onboarding screens are fully integrated. Users see the splash screen first and must complete registration before accessing the game.

### Features:
- Splash hook screen
- 3-step form with progressive disclosure
- Summary & consent page with modal for privacy policy
- Data persistence via localStorage
- Fully responsive design
- Client-side validation

### To Use:
Simply load `digital-truth.html` in a browser. The onboarding flow loads automatically.

### Customization:
- Edit screen texts in `OnboardingComponents.SCREENS` object
- Modify form fields in `SCREENS.FORM.fields`
- Change colors via CSS variables: `--acc` (green), `--warn` (red), etc.

---

## 2. Unity (C#)

### Architecture Pattern:

```csharp
// 1. Data Model
[System.Serializable]
public class AgentProfile {
    public string callsign;
    public string gender;
    public string age;
    public string region;
    public Dictionary<string, string> optional; // education, activity, platform, etc.
    public System.DateTime completedAt;
}

// 2. Manager Class
public class OnboardingManager : MonoBehaviour {
    private AgentProfile agentData;
    public static OnboardingManager Instance { get; private set; }
    
    void Awake() {
        if (Instance == null) {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
    }
    
    public bool HasCompletedOnboarding() {
        return PlayerPrefs.HasKey("agentData");
    }
    
    public void SaveAgentData(AgentProfile data) {
        string json = JsonUtility.ToJson(data);
        PlayerPrefs.SetString("agentData", json);
        agentData = data;
    }
    
    public AgentProfile GetAgentData() {
        if (agentData == null && PlayerPrefs.HasKey("agentData")) {
            agentData = JsonUtility.FromJson<AgentProfile>(PlayerPrefs.GetString("agentData"));
        }
        return agentData;
    }
}

// 3. UI Flow
public class OnboardingUIController : MonoBehaviour {
    [SerializeField] private Canvas splashScreen;
    [SerializeField] private Canvas welcomeScreen;
    [SerializeField] private Canvas formScreen;
    [SerializeField] private Canvas consentScreen;
    
    private AgentProfile tempData;
    
    public void ShowSplash() => ShowScreen(splashScreen);
    public void ShowWelcome() => ShowScreen(welcomeScreen);
    public void ShowForm() => ShowScreen(formScreen);
    public void ShowConsent() {
        // Populate summary from tempData
        ShowScreen(consentScreen);
    }
    
    public void CompleteOnboarding() {
        OnboardingManager.Instance.SaveAgentData(tempData);
        // Load game scene
        SceneManager.LoadScene("MainGame");
    }
    
    private void ShowScreen(Canvas screen) {
        HideAllScreens();
        screen.enabled = true;
    }
    
    private void HideAllScreens() {
        splashScreen.enabled = false;
        welcomeScreen.enabled = false;
        formScreen.enabled = false;
        consentScreen.enabled = false;
    }
}

// 4. Form Input Handling
public class FormInputHandler : MonoBehaviour {
    [SerializeField] private InputField callsignInput;
    [SerializeField] private Dropdown genderDropdown;
    [SerializeField] private Dropdown ageDropdown;
    [SerializeField] private Dropdown regionDropdown;
    
    public void OnFormSubmit() {
        AgentProfile profile = new AgentProfile {
            callsign = callsignInput.text,
            gender = genderDropdown.options[genderDropdown.value].text,
            age = ageDropdown.options[ageDropdown.value].text,
            region = regionDropdown.options[regionDropdown.value].text,
            optional = new Dictionary<string, string>(),
            completedAt = System.DateTime.Now
        };
        
        OnboardingManager.Instance.SaveAgentData(profile);
    }
}
```

### Implementation Steps:

1. Create 4 separate Canvas objects for each screen
2. Create `OnboardingManager` singleton for data persistence
3. Use `PlayerPrefs` for data storage (or Newtonsoft JSON for complex objects)
4. Link UI buttons to navigation methods
5. Validate required fields before allowing "Next"
6. Show/hide screens via Canvas.enabled

### Assets Needed:
- UI Prefabs for: Splash, Welcome, Form, Consent screens
- Button prefabs with consistent styling
- Dropdown/InputField prefabs for form inputs
- Modal prefab for privacy policy

---

## 3. Godot (GDScript)

### Scene Structure:

```
OnboardingScene/
├── SplashScreen (Control)
├── WelcomeScreen (Control)
├── FormScreen (VBoxContainer)
│   ├── CallsignInput (LineEdit)
│   ├── GenderOptions (VBoxContainer)
│   ├── AgeOptions (VBoxContainer)
│   └── RegionSelect (OptionButton)
├── ConsentScreen (Control)
│   ├── Summary (Label)
│   └── CheckBoxes (VBoxContainer)
└── PrivacyModal (PopupPanel)
```

### GDScript Implementation:

```gdscript
# onboarding_manager.gd
extends Node

class_name OnboardingManager

var agent_data: Dictionary = {}

func _ready():
	load_agent_data()
	if not has_completed_onboarding():
		get_tree().call_group("ui_screens", "hide")
		$SplashScreen.show()

func save_agent_data(data: Dictionary) -> void:
	agent_data = data
	agent_data["completed_at"] = Time.get_ticks_msec()
	var save_path = "user://agent_data.json"
	var file = FileAccess.open(save_path, FileAccess.WRITE)
	file.store_string(JSON.stringify(agent_data))

func load_agent_data() -> void:
	var save_path = "user://agent_data.json"
	if ResourceLoader.exists(save_path):
		var file = FileAccess.open(save_path, FileAccess.READ)
		var json = JSON.parse_string(file.get_as_text())
		if json:
			agent_data = json

func has_completed_onboarding() -> bool:
	return agent_data.has("completed_at")

func navigate(screen_name: String) -> void:
	get_tree().call_group("ui_screens", "hide")
	get_node(screen_name).show()
```

---

## 4. Construct 3

### Event Sheet Setup:

1. **Global Variables:**
   - `agentCallsign` (text)
   - `agentGender` (text)
   - `agentAge` (text)
   - `agentRegion` (text)
   - `onboardingStep` (0-3)

2. **Browser Storage:**
   ```
   On page load:
     → Set agentCallsign to LocalStorage.ItemValue("callsign")
     → If LocalStorage.ItemValue("callsign") != "" → Go to MainLayout
     → Else → Go to SplashLayout
   ```

3. **Form Validation:**
   ```
   On "Next" button click:
     → If agentCallsign = "" → Show error toast
     → Else if gender dropdown = "—" → Show error toast
     → Else if age dropdown = "—" → Show error toast
     → Else if region dropdown = "—" → Show error toast
     → Else → Set onboardingStep to 2, Go to FormLayout
   ```

4. **Save Data:**
   ```
   On "Activate" button click:
     → LocalStorage.SetItem("callsign", agentCallsign)
     → LocalStorage.SetItem("agentData", JSON.stringify(agentProfile))
     → Show toast: "Идентификация завершена"
     → Go to MainLayout
   ```

### Layers Structure:
- Layer 0: SplashLayout (Splash screen)
- Layer 1: WelcomeLayout (Welcome message)
- Layer 2: FormLayout (All form fields)
- Layer 3: ConsentLayout (Privacy + checkboxes)
- Layer 4: MainLayout (Game starts here)

---

## 5. Defold (Engine)

### Collections Structure:

```
/onboarding/
├── onboarding.collection
├── screens/
│   ├── splash.go / splash.sprite
│   ├── welcome.go / welcome.sprite
│   ├── form.go / form.script
│   ├── consent.go / consent.script
│   └── privacy_modal.go
└── onboarding.script
```

### Main Script:

```lua
-- onboarding/onboarding.script
go.property("screen", 0)  -- 0: splash, 1: welcome, 2: form, 3: consent

local agent_data = {}

function init(self)
    if check_onboarding_complete() then
        msg.post("#", "show_main_game")
    else
        show_screen(0)
    end
end

function show_screen(self, screen_id)
    msg.post("#splash", "disable")
    msg.post("#welcome", "disable")
    msg.post("#form", "disable")
    msg.post("#consent", "disable")
    
    if screen_id == 0 then
        msg.post("#splash", "enable")
    elseif screen_id == 1 then
        msg.post("#welcome", "enable")
    -- etc.
    end
end

function save_agent_data(self, data)
    agent_data = data
    agent_data.completed_at = os.time()
    local json_str = json.encode(agent_data)
    sys.save("agent.profile", json_str)
end

function check_onboarding_complete()
    local success, data = pcall(sys.load, "agent.profile")
    return success and data ~= nil
end
```

---

## 6. React/Next.js

### Component Structure:

```jsx
// components/Onboarding/index.tsx
import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import WelcomeScreen from './WelcomeScreen';
import FormScreen from './FormScreen';
import ConsentScreen from './ConsentScreen';
import PrivacyModal from './PrivacyModal';

interface AgentProfile {
  callsign: string;
  gender: string;
  age: string;
  region: string;
  [key: string]: any;
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [agentData, setAgentData] = useState<Partial<AgentProfile>>({});
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('agentData');
    if (saved) {
      setAgentData(JSON.parse(saved));
    }
  }, []);

  const handleFormSubmit = (formData: Partial<AgentProfile>) => {
    setAgentData(prev => ({ ...prev, ...formData }));
    setStep(3);
  };

  const handleCompleteOnboarding = () => {
    const finalData = {
      ...agentData,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('agentData', JSON.stringify(finalData));
    // Navigate to game
  };

  const screens = [
    <SplashScreen key="0" onNext={() => setStep(1)} />,
    <WelcomeScreen key="1" onNext={() => setStep(2)} />,
    <FormScreen key="2" onSubmit={handleFormSubmit} />,
    <ConsentScreen key="3" onComplete={handleCompleteOnboarding} />
  ];

  return (
    <>
      <div className="onboarding-container">
        {screens[step]}
      </div>
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </>
  );
}
```

### Custom Hook:

```tsx
// hooks/useAgentData.ts
export function useAgentData() {
  const [agent, setAgent] = useState<AgentProfile | null>(null);

  const save = (data: AgentProfile) => {
    const toSave = { ...data, completedAt: new Date().toISOString() };
    localStorage.setItem('agentData', JSON.stringify(toSave));
    setAgent(toSave);
  };

  const load = () => {
    const stored = localStorage.getItem('agentData');
    if (stored) {
      setAgent(JSON.parse(stored));
      return true;
    }
    return false;
  };

  return { agent, save, load };
}
```

---

## 7. Flutter

### Dart Model:

```dart
// models/agent_profile.dart
class AgentProfile {
  final String callsign;
  final String gender;
  final String age;
  final String region;
  final DateTime completedAt;
  final Map<String, String> optional;

  AgentProfile({
    required this.callsign,
    required this.gender,
    required this.age,
    required this.region,
    this.completedAt,
    this.optional = const {},
  });

  Map<String, dynamic> toJson() => {
    'callsign': callsign,
    'gender': gender,
    'age': age,
    'region': region,
    'completedAt': completedAt.toIso8601String(),
    'optional': optional,
  };

  factory AgentProfile.fromJson(Map<String, dynamic> json) => AgentProfile(
    callsign: json['callsign'],
    gender: json['gender'],
    age: json['age'],
    region: json['region'],
    completedAt: DateTime.parse(json['completedAt']),
    optional: Map.from(json['optional'] ?? {}),
  );
}
```

### Provider for State Management:

```dart
// providers/agent_provider.dart
class AgentProvider extends ChangeNotifier {
  AgentProfile? _agent;

  Future<void> saveAgent(AgentProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('agentData', jsonEncode(profile.toJson()));
    _agent = profile;
    notifyListeners();
  }

  Future<bool> loadAgent() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('agentData');
    if (data != null) {
      _agent = AgentProfile.fromJson(jsonDecode(data));
      return true;
    }
    return false;
  }

  AgentProfile? get agent => _agent;
}
```

---

## General Principles for All Platforms

### 1. Data Flow
```
Splash Screen → Welcome → Form (collect data) → Consent (verify agreement) → Complete
                ↓                                  ↓
           Save to persistence          Show in summary
```

### 2. Validation Rules
- **Callsign**: Required, max 32 characters
- **Gender**: Required, one of 5 options
- **Age**: Required, one of 5 ranges
- **Region**: Required, dropdown selection
- **Others**: Optional demographic questions

### 3. Storage Strategy
- **Web**: localStorage (browser)
- **Unity/Godot**: PlayerPrefs / Local files
- **Construct**: Browser storage
- **React**: localStorage + Context/Redux
- **Flutter**: SharedPreferences

### 4. Success Flow
1. User fills form
2. Data is validated client-side
3. Summary is shown for review
4. User confirms privacy agreements
5. Data is persisted
6. Toast notification: "Идентификация завершена. Добро пожаловать в миссию, [Callsign]!"
7. Redirect to main game

### 5. Privacy Modal
All platforms should show an expandable "Privacy Policy" modal with:
- Who processes data
- What is collected
- Purpose
- Storage duration
- Contact info

---

## Testing Checklist

- [ ] Splash screen loads on first visit
- [ ] All form fields render correctly
- [ ] Required fields can't be skipped (Next button disabled)
- [ ] Summary shows correct values from form
- [ ] Both consent checkboxes required to activate
- [ ] Success message shows correct callsign
- [ ] Data persists after reload
- [ ] Privacy modal opens/closes correctly
- [ ] Back buttons navigate correctly
- [ ] Responsive on mobile devices
- [ ] Accessibility (labels, focus, keyboard nav)

