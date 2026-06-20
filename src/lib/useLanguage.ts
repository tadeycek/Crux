import { useState } from 'react'
import type { Language } from '../components/editor/CodeEditor'

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('telery-language') as Language) ?? 'python'
  })

  function setLanguage(lang: Language) {
    localStorage.setItem('telery-language', lang)
    setLanguageState(lang)
  }

  return { language, setLanguage }
}
