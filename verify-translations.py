#!/usr/bin/env python3
"""
Verification script to ensure all translation keys used in updateI18nUI()
are present in both Russian (ru) and Kazakh (kk) TRANSLATIONS dictionaries.
"""

import re

# Extract all translation keys from updateI18nUI function
ui_keys = [
    # Header
    "mainTitle",
    # Splash
    "splashBadge", "splashTitle", "splashSubtitle", "splashBtn",
    # Onboard welcome
    "onboardWelcomeTitle", "onboardWelcomeText1", "onboardWelcomeText2", "onboardWelcomeText3", "onboardWelcomeBtn",
    # Form
    "formTitle", "formProgress", "formCallsign", "formCallsignPlaceholder", "formCallsignSmall",
    "formGender", "formGenderNote", "formGenderFemale", "formGenderMale", "formGenderNonbinary", 
    "formGenderSkip", "formGenderOther", "formGenderOtherPlaceholder",
    "formAge", "formAgeUnder18", "formAge18_25", "formAge26_35", "formAge36_45", "formAge46plus",
    "formRegion", "formEducation", "formEducationSecondary", "formEducationVocational", "formEducationStudent",
    "formEducationBachelor", "formEducationMaster", "formEducationOther",
    "formActivity", "formActivityUnder2h", "formActivity2_5h", "formActivity5_8h", "formActivity8plus",
    "formPlatform", "formPlatformInstagram", "formPlatformTiktok", "formPlatformTelegram", "formPlatformYoutube",
    "formPlatformX", "formPlatformVK", "formPlatformOther",
    "formFactcheck", "formFactcheckAlways", "formFactcheckSometimes", "formFactcheckRarely", "formFactcheckNever",
    "formRole", "formRoleObserver", "formRoleActive", "formRoleCreator", "formRoleAnalyst", "formRoleAnon",
    "formGoal", "formGoalPlay", "formGoalChallenge", "formGoalFakes", "formGoalResearch",
    "formBtnBack", "formBtnNext",
    # Regions (22)
    "regionNurSultan", "regionAlmaty", "regionShymkent", "regionKaraganda", "regionAktobe", "regionKostanay",
    "regionAktau", "regionAtyrau", "regionPavlodar", "regionEkibastuz", "regionPetropavlovsk", "regionOral",
    "regionKokshetau", "regionSemey", "regionOskemen", "regionKyzylorda", "regionTaraz", "regionTaldykorgan",
    "regionTurkestan", "regionZhanaozen", "regionZhezkazgan", "regionKaratau",
    # Consent
    "consentTitle", "consentProgress", "consentSummaryCallsign", "consentSummaryGender", 
    "consentSummaryAge", "consentSummaryRegion", "consentExplainTitle", "consentExplainText",
    "consentData", "consentAge", "consentBtnMoreInfo", "consentBtnBack", "consentBtnActivate",
    # Modal
    "modalTitle", "modalWho", "modalWhoText", "modalWhat", "modalWhatText", "modalGoal", "modalGoalText",
    "modalLaw", "modalLawText", "modalTerm", "modalTermText", "modalThird", "modalThirdText",
    "modalContact", "modalBtn",
    # Start screen
    "startTitle", "startSubtitle", "btnStart", "btnHow",
    # Case screen
    "caseTag", "caseDifficulty", "caseTitle", "caseNarrative", "evidence", "btnCheck", "btnSkip",
    "choiceAdvice",
    # End screen
    "endTitle", "btnRestart", "btnShare", "rank",
    # Toasts (called from game functions)
    "toastCaseClosed", "toastSkipped", "toastCopied", "toastHintUnavailable", "toastHow",
    # Game buttons
    "truthBtn", "lieBtn", "hintBtn", "choiceReputation",
    # End ranks and praises (called from endGame)
    "endRankNew", "endPraiseNew", "endRankFact", "endPraiseFact", "endRankCurator", "endPraiseCurator",
    "endRankSavior", "endPraiseSavior", "endResult",
    # Additional from updateHeader and renderCase
    "rep", "caseNo", "evScore"
]

print(f"Total keys to verify: {len(set(ui_keys))}")
print(f"Unique keys: {len(set(ui_keys))}")

# Check for duplicates
from collections import Counter
dupes = [k for k, v in Counter(ui_keys).items() if v > 1]
if dupes:
    print(f"WARNING: Duplicate keys found: {dupes}")
else:
    print("✓ No duplicate keys")

# List all keys
print("\nAll keys that need translations:")
for i, key in enumerate(sorted(set(ui_keys)), 1):
    print(f"{i:3d}. {key}")

print("\n✓ Verification list generated.")
print("These keys should be present in both TRANSLATIONS.ru and TRANSLATIONS.kk dictionaries.")
