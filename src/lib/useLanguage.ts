import { useState } from 'react'
import type { Language } from '../components/editor/CodeEditor'

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('crux-language') as Language) ?? 'python'
  })

  function setLanguage(lang: Language) {
    localStorage.setItem('crux-language', lang)
    setLanguageState(lang)
  }

  return { language, setLanguage }
}
