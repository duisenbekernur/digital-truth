#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

# Read original HTML
with open('digital-truth.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Read new cases JS
with open('NEW_CASES_AND_LOGIC.js', 'r', encoding='utf-8') as f:
    new_cases_content = f.read()

# Find and replace the old CASES array with new one
# First, locate "const CASES = [" and the matching "];"
pattern = r'(\/\*\* ======== ДАННЫЕ СЮЖЕТОВ \(можно расширять\) ======== \*\/\s*)(const CASES = \[[\s\S]*?\n\];)'

replacement = r'\1' + new_cases_content.replace('// ========== ALL 12 NEW CASES (KAZAKH) ==========\n', '')

html_content = re.sub(pattern, replacement, html_content, count=1)

# Update references from CASES to activeCases
# But first, we need to initialize activeCases in game start
# Find the button click handler for "#btnStart"
game_init_pattern = r'($("#btnStart")\.addEventListener\("click",\s*\(\)=>\{\s*)("#start"\.style\.display = "none";)'

game_init_replacement = r'''let activeCases = getRandomCases();
  state = { idx: 0, rep: 0, answers: {}, cases: activeCases };
  updateHeader();\n  \2'''

html_content = re.sub(game_init_pattern, game_init_replacement, html_content)

# Also update updateHeader to use activeCases length
header_pattern = r'(\$\("#caseNo"\)\.textContent = `Дело — \$\{state\.idx\+1\} \/ \$\{)CASES\.length'
header_replacement = r'\1(state.cases?.length || CASES_ALL.length)'
html_content = re.sub(header_pattern, header_replacement, html_content)

# Update all renderCase references to use state.cases instead of CASES
rendercase_pattern = r'const c = CASES\[state\.idx\];'
rendercase_replacement = r'const c = state.cases[state.idx];'
html_content = re.sub(rendercase_pattern, rendercase_replacement, html_content)

# Update endGame to check activeCases length
endgame_pattern = r'(if\(state\.idx >= )CASES\.length'
endgame_replacement = r'\1(state.cases?.length || CASES_ALL.length)'
html_content = re.sub(endgame_pattern, endgame_replacement, html_content)

# Save updated HTML
with open('digital-truth.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("✓ Case library updated successfully!")
print("✓ 12 new Kazakh cases integrated")
print("✓ Random 4-case selection enabled")
print("✓ Game flow updated to use random cases")
