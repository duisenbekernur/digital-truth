/**
 * Digital Truth: Onboarding Component Module
 * Reusable across Web, Unity, Construct, and native platforms
 * 
 * Export this module for use in different frameworks
 */

const OnboardingComponents = {
  // ========== DATA SCHEMA ==========
  AGENT_SCHEMA: {
    callsign: { type: "string", required: true, maxLength: 32 },
    gender: { type: "enum", required: true, values: ["female", "male", "nonbinary", "skip", "other"] },
    genderOther: { type: "string", maxLength: 20, conditional: "gender === 'other'" },
    age: { type: "enum", required: true, values: ["under18", "18-25", "26-35", "36-45", "46plus"] },
    region: { type: "enum", required: true, values: ["russia", "ukraine", "belarus", "kazakhstan", "other-cis", "europe", "americas", "asia", "africa", "other"] },
    education: { type: "enum", values: ["secondary", "vocational", "student", "bachelor", "master", "other"] },
    activity: { type: "enum", values: ["under2h", "2-5h", "5-8h", "8plus"] },
    platform: { type: "enum", values: ["instagram", "tiktok", "telegram", "youtube", "x", "vk", "other"] },
    factcheck: { type: "enum", values: ["always", "sometimes", "rarely", "never"] },
    role: { type: "enum", values: ["observer", "active", "creator", "analyst", "anon"] },
    goal: { type: "enum", values: ["play", "challenge", "fakes", "research"] },
    completedAt: { type: "ISO8601" }
  },

  // ========== UI SCREENS ==========
  SCREENS: {
    SPLASH: {
      id: "splash",
      title: "Digital Truth: Идентификация агента",
      subtitle: "Доступ к базе \"Digital Shield\" возможен только после регистрации агента.",
      button: "Начать идентификацию",
      style: "hero-centered"
    },
    WELCOME: {
      id: "onboard-welcome",
      title: "Добро пожаловать, Агент",
      points: [
        "Мы тестируем вашу цифровую интуицию и навык факт-чека.",
        "Регистрация нужна, чтобы настроить миссии и собрать анонимную статистику.",
        "Это займёт < 1 минуты."
      ],
      button: "Заполнить паспортичку"
    },
    FORM: {
      id: "onboard-form",
      title: "Паспорт агента",
      progress: "Шаг 2 из 3",
      fields: [
        {
          id: "callsign",
          label: "Позывной агента",
          type: "text",
          required: true,
          placeholder: "Пример: Agent Nova",
          help: "Это ваш публичный ник; личных данных не просим."
        },
        {
          id: "gender",
          label: "Пол",
          type: "radio",
          required: true,
          help: "(для анализа восприятия)",
          options: [
            { value: "female", label: "Женский" },
            { value: "male", label: "Мужской" },
            { value: "nonbinary", label: "Небинарный" },
            { value: "skip", label: "Не указывать" },
            { value: "other", label: "Другое", subfield: { type: "text", placeholder: "Укажите" } }
          ]
        },
        {
          id: "age",
          label: "Возрастная группа",
          type: "radio",
          required: true,
          options: [
            { value: "under18", label: "<18 лет" },
            { value: "18-25", label: "18–25 лет" },
            { value: "26-35", label: "26–35 лет" },
            { value: "36-45", label: "36–45 лет" },
            { value: "46plus", label: "46+ лет" }
          ]
        },
        {
          id: "region",
          label: "Регион / Город",
          type: "select",
          required: true,
          options: [
            { value: "russia", label: "Россия" },
            { value: "ukraine", label: "Украина" },
            { value: "belarus", label: "Беларусь" },
            { value: "kazakhstan", label: "Казахстан" },
            { value: "other-cis", label: "Другие страны СНГ" },
            { value: "europe", label: "Европа" },
            { value: "americas", label: "Америки" },
            { value: "asia", label: "Азия" },
            { value: "africa", label: "Африка" },
            { value: "other", label: "Другое" }
          ]
        },
        {
          id: "education",
          label: "Уровень образования",
          type: "select",
          required: false,
          options: [
            { value: "secondary", label: "Среднее" },
            { value: "vocational", label: "Среднее специальное" },
            { value: "student", label: "Студент" },
            { value: "bachelor", label: "Высшее (бакалавр)" },
            { value: "master", label: "Высшее (магистр, PhD)" },
            { value: "other", label: "Другое" }
          ]
        },
        {
          id: "activity",
          label: "Онлайн-активность в день",
          type: "radio",
          required: false,
          options: [
            { value: "under2h", label: "<2ч" },
            { value: "2-5h", label: "2–5ч" },
            { value: "5-8h", label: "5–8ч" },
            { value: "8plus", label: "8+ часов" }
          ]
        },
        {
          id: "platform",
          label: "Любимая платформа",
          type: "radio",
          required: false,
          options: [
            { value: "instagram", label: "Instagram" },
            { value: "tiktok", label: "TikTok" },
            { value: "telegram", label: "Telegram" },
            { value: "youtube", label: "YouTube" },
            { value: "x", label: "X (Twitter)" },
            { value: "vk", label: "VK" },
            { value: "other", label: "Другое" }
          ]
        },
        {
          id: "factcheck",
          label: "Как часто ты проверяешь факты?",
          type: "radio",
          required: false,
          options: [
            { value: "always", label: "Всегда" },
            { value: "sometimes", label: "Иногда" },
            { value: "rarely", label: "Редко" },
            { value: "never", label: "Никогда" }
          ]
        },
        {
          id: "role",
          label: "Твоя роль в сети",
          type: "radio",
          required: false,
          options: [
            { value: "observer", label: "Наблюдатель" },
            { value: "active", label: "Активный" },
            { value: "creator", label: "Создатель" },
            { value: "analyst", label: "Аналитик" },
            { value: "anon", label: "Аноним" }
          ]
        },
        {
          id: "goal",
          label: "Цель участия",
          type: "radio",
          required: false,
          options: [
            { value: "play", label: "Играю" },
            { value: "challenge", label: "Проверить себя" },
            { value: "fakes", label: "Тема фейков интересует" },
            { value: "research", label: "Участвую в исследовании" }
          ]
        }
      ]
    },
    CONSENT: {
      id: "onboard-consent",
      title: "Проверка данных агента",
      progress: "Шаг 3 из 3",
      summary: {
        title: "О данных простыми словами",
        text: "Мы собираем только анонимные ответы и игровые действия (выборы, время реакции, ошибки/успехи). Личных данных (ФИО, телефон и т.п.) — нет."
      },
      consents: [
        {
          id: "consentData",
          text: "Я согласен(сна) на обработку моих анонимных данных для исследовательских целей и улучшения игры.",
          required: true
        },
        {
          id: "consentAge",
          text: "Мне 16 лет и больше.",
          required: true
        }
      ],
      moreInfoLink: "Подробнее о защите данных",
      button: "Активировать профиль агента"
    },
    PRIVACY_POLICY: {
      title: "Как мы обрабатываем ваши данные",
      sections: [
        { label: "Кто обрабатывает данные", text: 'команда проекта "Digital Truth".' },
        { label: "Что собираем", text: "пол, возрастной диапазон, регион, ответы на вопросы и игровые действия (время реакции, решения, успех/ошибка)." },
        { label: "Цель", text: "исследование восприятия цифровой информации и улучшение механик игры." },
        { label: "Правовая основа", text: "добровольное согласие участника." },
        { label: "Срок хранения", text: "до окончания исследования (не более 24 месяцев), затем данные удаляются или остаются только в полностью агрегированном виде." },
        { label: "Передача третьим лицам", text: "только в виде обезличенной статистики." },
        { label: "Контакты", text: "support@digitaltruth.game для вопросов или отзыва согласия." }
      ]
    }
  },

  // ========== VALIDATION ==========
  validate: function(data) {
    const errors = [];
    
    if (!data.callsign || data.callsign.trim().length === 0) {
      errors.push("callsign: required");
    }
    if (!data.gender) {
      errors.push("gender: required");
    }
    if (!data.age) {
      errors.push("age: required");
    }
    if (!data.region) {
      errors.push("region: required");
    }
    
    return { valid: errors.length === 0, errors };
  },

  // ========== DATA PERSISTENCE ==========
  saveToStorage: function(data) {
    const toSave = {
      ...data,
      completedAt: new Date().toISOString()
    };
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("agentData", JSON.stringify(toSave));
    }
    return toSave;
  },

  loadFromStorage: function() {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("agentData");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  clearStorage: function() {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("agentData");
    }
  },

  // ========== LOCALIZATION ==========
  GENDER_LABELS: {
    female: "Женский",
    male: "Мужской",
    nonbinary: "Небинарный",
    skip: "Не указан",
    other: "Другое"
  },

  AGE_LABELS: {
    "under18": "<18",
    "18-25": "18–25",
    "26-35": "26–35",
    "36-45": "36–45",
    "46plus": "46+"
  },

  SUCCESS_MESSAGE: (callsign) => `Идентификация завершена. Добро пожаловать в миссию, ${callsign}!`
};

// Export for different environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = OnboardingComponents;
}
