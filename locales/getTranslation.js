import { useRouter } from 'next/router'
import enUS from './enUS.json'
import es from './es.json'
import ptBR from './ptBR.json'

export default function getTranslation() {
    const router = useRouter()
    const { locale } = router

    switch(locale) {
        case 'es': 
            return es
        case 'en-US':
            return enUS
        default:
            return ptBR
    }
}