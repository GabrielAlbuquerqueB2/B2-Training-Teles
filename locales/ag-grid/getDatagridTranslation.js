import { useRouter } from 'next/router'
import es from './es.js'
import ptBR from './ptBR.js'

export default function getTranslation() {
    const router = useRouter()
    const { locale } = router

    switch(locale) {
        case 'es': 
            return es
        case 'pt-BR':
            return ptBR        
    }
}