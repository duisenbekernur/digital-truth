# Copy-Paste Exports for Different Platforms

Quick copy-paste code snippets ready for your platform.

---

## 1. Web (Plain HTML Import)

```html
<!-- Minimal setup — just paste into your HTML -->
<script src="onboarding-components.js"></script>

<script>
// Check if onboarding complete, show splash if not
if (!OnboardingComponents.loadFromStorage()) {
  document.getElementById("splash").style.display = "block";
} else {
  document.getElementById("main-game").style.display = "block";
}

// Listen to activation button
document.getElementById("btnActivate").addEventListener("click", () => {
  const data = {
    callsign: document.getElementById("callsign").value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    age: document.querySelector('input[name="age"]:checked').value,
    region: document.getElementById("region").value,
  };
  OnboardingComponents.saveToStorage(data);
});
</script>
```

---

## 2. React/TypeScript

```tsx
// hooks/useOnboarding.ts
import { useState, useEffect } from 'react';

const AGENT_SCHEMA = {
  callsign: '', gender: '', age: '', region: '',
};

export function useOnboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(AGENT_SCHEMA);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('agentData');
    if (saved) {
      setData(JSON.parse(saved));
      setIsComplete(true);
      setStep(-1); // Hide onboarding
    }
  }, []);

  const saveData = (newData: typeof AGENT_SCHEMA) => {
    const complete = {
      ...newData,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem('agentData', JSON.stringify(complete));
    setData(complete);
    setIsComplete(true);
  };

  const reset = () => {
    localStorage.removeItem('agentData');
    setData(AGENT_SCHEMA);
    setIsComplete(false);
    setStep(0);
  };

  return { step, setStep, data, setData, saveData, isComplete, reset };
}

// Component usage
export default function App() {
  const { step, isComplete, data } = useOnboarding();

  if (isComplete) {
    return <GameBoard agent={data} />;
  }

  return <OnboardingFlow step={step} />;
}
```

---

## 3. Vue 3

```vue
<!-- OnboardingModal.vue -->
<template>
  <div v-if="!isComplete" class="onboarding">
    <component :is="screens[step]" @next="step++" @complete="complete" />
  </div>
  <GameBoard v-else :agent="agentData" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SplashScreen from './SplashScreen.vue';
import FormScreen from './FormScreen.vue';
import ConsentScreen from './ConsentScreen.vue';

interface Agent {
  callsign: string;
  gender: string;
  age: string;
  region: string;
}

const step = ref(0);
const isComplete = ref(false);
const agentData = ref<Agent | null>(null);

const screens = [SplashScreen, FormScreen, ConsentScreen];

onMounted(() => {
  const saved = localStorage.getItem('agentData');
  if (saved) {
    agentData.value = JSON.parse(saved);
    isComplete.value = true;
  }
});

const complete = (data: Agent) => {
  agentData.value = { ...data, completedAt: new Date().toISOString() };
  localStorage.setItem('agentData', JSON.stringify(agentData.value));
  isComplete.value = true;
};
</script>
```

---

## 4. Unity C#

```csharp
// OnboardingManager.cs
using UnityEngine;
using System;

[System.Serializable]
public class AgentProfile
{
    public string callsign;
    public string gender;
    public string age;
    public string region;
    public DateTime completedAt;
}

public class OnboardingManager : MonoBehaviour
{
    private static OnboardingManager instance;
    private AgentProfile agentProfile;

    void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
    }

    void Start()
    {
        if (HasCompleted())
        {
            SceneManager.LoadScene("MainGame");
        }
        else
        {
            ShowOnboarding();
        }
    }

    public void SaveAgent(string callsign, string gender, string age, string region)
    {
        agentProfile = new AgentProfile
        {
            callsign = callsign,
            gender = gender,
            age = age,
            region = region,
            completedAt = DateTime.Now
        };
        
        string json = JsonUtility.ToJson(agentProfile);
        PlayerPrefs.SetString("agentProfile", json);
        
        SceneManager.LoadScene("MainGame");
    }

    public AgentProfile GetAgent() => agentProfile;

    private bool HasCompleted()
    {
        return PlayerPrefs.HasKey("agentProfile");
    }

    private void ShowOnboarding()
    {
        gameObject.GetComponent<OnboardingUI>().Show();
    }
}
```

---

## 5. Godot/GDScript

```gdscript
# autoload/onboarding.gd
extends Node

var agent_data: Dictionary = {}
var is_complete: bool = false

func _ready():
    load_data()
    if not is_complete:
        get_tree().root.add_child(preload("res://screens/onboarding.tscn").instantiate())

func save_data(callsign: String, gender: String, age: String, region: String) -> void:
    agent_data = {
        "callsign": callsign,
        "gender": gender,
        "age": age,
        "region": region,
        "completed_at": Time.get_ticks_msec()
    }
    
    var file = FileAccess.open("user://agent.json", FileAccess.WRITE)
    file.store_string(JSON.stringify(agent_data))
    
    is_complete = true
    get_tree().change_scene_to_file("res://game/main.tscn")

func load_data() -> void:
    if ResourceLoader.exists("user://agent.json"):
        var file = FileAccess.open("user://agent.json", FileAccess.READ)
        var data = JSON.parse_string(file.get_as_text())
        if data:
            agent_data = data
            is_complete = true

func get_agent() -> Dictionary:
    return agent_data
```

---

## 6. Flutter/Dart

```dart
// lib/providers/agent_provider.dart
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/agent_profile.dart';

class AgentProvider with ChangeNotifier {
  AgentProfile? _agent;
  bool _isComplete = false;

  bool get isComplete => _isComplete;
  AgentProfile? get agent => _agent;

  Future<void> initialize() async {
    await loadAgent();
  }

  Future<void> loadAgent() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getString('agentData');
      if (data != null) {
        _agent = AgentProfile.fromJson(jsonDecode(data));
        _isComplete = true;
        notifyListeners();
      }
    } catch (e) {
      print('Error loading agent: $e');
    }
  }

  Future<void> saveAgent(AgentProfile profile) async {
    _agent = profile..completedAt = DateTime.now();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('agentData', jsonEncode(_agent!.toJson()));
    _isComplete = true;
    notifyListeners();
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('agentData');
    _agent = null;
    _isComplete = false;
    notifyListeners();
  }
}

// lib/screens/onboarding_screen.dart
class OnboardingScreen extends StatefulWidget {
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _step = 0;
  String _callsign = '';
  String _gender = '';
  String _age = '';
  String _region = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _buildScreen(),
    );
  }

  Widget _buildScreen() {
    switch (_step) {
      case 0: return _splashScreen();
      case 1: return _formScreen();
      case 2: return _consentScreen();
      default: return SizedBox.shrink();
    }
  }

  void _submitForm() {
    final agent = AgentProfile(
      callsign: _callsign,
      gender: _gender,
      age: _age,
      region: _region,
      completedAt: DateTime.now(),
    );
    
    Provider.of<AgentProvider>(context, listen: false).saveAgent(agent);
    Navigator.of(context).pushReplacementNamed('/game');
  }

  // ... implement _splashScreen(), _formScreen(), etc.
}
```

---

## 7. Construct 3 (Event Sheet)

```
## Global Variables:
- agentCallsign (text) = ""
- agentGender (text) = ""
- agentAge (text) = ""
- agentRegion (text) = ""
- onboardingStep (number) = 0

## On Page Load:
→ Browser: Load item "agentData" (in variable)
→ If BrowserData.ItemValue("agentData") ≠ "" 
  → Go to layout "GameLayout"
→ Else
  → Go to layout "SplashLayout"

## Button: "Splash → Next"
→ If agentCallsign = ""
  → Browser: Show toast "Заполни позывной"
→ Else
  → Set agentCallsign to TextInput.Text
  → Go to layout "FormLayout"

## Button: "Form → Next"
→ If DropdownGender.SelectedText = "—"
  → Browser: Show toast "Выбери пол"
→ Else if DropdownAge.SelectedText = "—"
  → Browser: Show toast "Выбери возраст"
→ Else if DropdownRegion.SelectedText = "—"
  → Browser: Show toast "Выбери регион"
→ Else
  → Set agentGender to DropdownGender.SelectedText
  → Set agentAge to DropdownAge.SelectedText
  → Set agentRegion to DropdownRegion.SelectedText
  → Go to layout "ConsentLayout"

## Button: "Consent → Activate"
→ If CheckboxConsent.Checked = False OR CheckboxAge.Checked = False
  → Browser: Show toast "Согласись с условиями"
→ Else
  → Browser: Set item "agentData" with Dictionary:
    { "callsign": agentCallsign, "gender": agentGender, "age": agentAge, "region": agentRegion, "completedAt": Now() }
  → Browser: Show toast "Идентификация завершена!"
  → Go to layout "GameLayout"
```

---

## 8. JSON Storage Example

```json
{
  "callsign": "Agent Zenith",
  "gender": "male",
  "age": "26-35",
  "region": "russia",
  "education": "master",
  "activity": "5-8h",
  "platform": "telegram",
  "factcheck": "always",
  "role": "analyst",
  "goal": "research",
  "completedAt": "2025-11-09T16:42:00Z"
}
```

---

## Minimal Validation Function

```javascript
function validateOnboarding(data) {
  const errors = [];
  if (!data.callsign?.trim()) errors.push("callsign required");
  if (!data.gender) errors.push("gender required");
  if (!data.age) errors.push("age required");
  if (!data.region) errors.push("region required");
  return { valid: errors.length === 0, errors };
}

// Usage:
const result = validateOnboarding(agentData);
if (!result.valid) {
  console.error(result.errors);
}
```

---

## Minimal Success Callback

```javascript
function onOnboardingComplete(agent) {
  const message = `Идентификация завершена. Добро пожаловать в миссию, ${agent.callsign}!`;
  
  // Toast
  console.log(message);
  
  // Persist
  localStorage.setItem("agentData", JSON.stringify(agent));
  
  // Navigate
  window.location.href = "/game";
}
```

