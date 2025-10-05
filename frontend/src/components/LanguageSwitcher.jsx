import { useTranslation } from 'react-i18next'
export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const toggle = () => {
    const next = i18n.language === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('i18nextLng', next)
  }
  return (<button onClick={toggle} className="btn bg-slate-100">{i18n.language === 'en' ? 'EN' : 'HI'}</button>)
}
