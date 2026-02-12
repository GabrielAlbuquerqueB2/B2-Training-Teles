import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { isLoggedIn } from '../services/authenticationProviderService'

export default function AuthProvider({ children }) {

    const router = useRouter()
    const isUserLoggedIn = isLoggedIn()

    useEffect(() => {

        if (!isUserLoggedIn) {
            router.push('/login')
        }
    }, [])

    if (router.pathname.includes('/login')) return children;

    return <>
        {
            isUserLoggedIn &&
            children
        }
    </>
}