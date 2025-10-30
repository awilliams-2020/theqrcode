# Simple Internationalization (i18n) Setup

This project now has a **simple, client-side only** internationalization solution that supports English and Spanish languages.

## ✅ What's Implemented

- **Simple Language Switching**: Users can switch between English and Spanish using the language switcher in the navbar
- **Client-Side Only**: No complex routing, middleware, or server-side configuration needed
- **Persistent Language Choice**: Language preference is saved in localStorage
- **Easy to Use**: Simple hook-based API for translations
- **No Dependencies**: No external i18n libraries required

## 🚀 How to Use

### 1. Using Translations in Components

```tsx
'use client'

import { useSimpleTranslation } from '@/hooks/useSimpleTranslation'

export default function MyComponent() {
  const { t, language } = useSimpleTranslation()
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button>{t('save')}</button>
      <p>Current language: {language}</p>
    </div>
  )
}
```

### 2. Language Switcher

The language switcher is automatically included in the navbar and allows users to switch between:
- 🇺🇸 English
- 🇪🇸 Español

### 3. Available Translation Keys

The system includes translations for:

**Common UI Elements:**
- `loading`, `error`, `success`, `save`, `cancel`, `delete`, `edit`, `create`
- `back`, `next`, `previous`, `close`, `open`, `search`, `filter`, `sort`
- `copy`, `download`, `upload`, `share`, `print`

**Navigation:**
- `home`, `about`, `features`, `pricing`, `contact`, `help`, `faq`, `blog`
- `dashboard`, `analytics`, `settings`, `profile`, `logout`, `login`, `register`

**QR Code Specific:**
- `qrTitle`, `qrDescription`, `qrGenerate`, `qrDownload`, `qrShare`
- `qrScans`, `qrTotalScans`, `qrUniqueVisitors`, `qrToday`, `qrThisWeek`
- And many more...

## 🔧 Adding New Translations

To add new translations, simply update the `translations` object in `/src/hooks/useSimpleTranslation.ts`:

```typescript
const translations = {
  en: {
    // ... existing translations
    newKey: 'New English Text',
  },
  es: {
    // ... existing translations
    newKey: 'Nuevo Texto en Español',
  }
}
```

## 🎯 Benefits of This Approach

1. **Simplicity**: No complex routing or middleware setup
2. **Performance**: Client-side only, no server-side overhead
3. **Maintainability**: Easy to understand and modify
4. **Flexibility**: Easy to add new languages or translation keys
5. **No Dependencies**: Uses only React hooks and localStorage
6. **SEO Friendly**: Works with existing URL structure

## 📝 Example Component

See `/src/components/TranslationExample.tsx` for a working example of how to use the translation system.

## 🌐 Adding New Languages

To add a new language (e.g., French):

1. Add the language to the `Language` type in `useSimpleTranslation.ts`
2. Add translations to the `translations` object
3. Add the language option to the `languages` array in `SimpleLanguageSwitcher.tsx`

This approach follows modern best practices for simple i18n implementations while keeping the codebase clean and maintainable.
