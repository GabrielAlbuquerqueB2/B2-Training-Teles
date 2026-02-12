import { useState, useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import SideMenu from '../SideMenu'
import Navbar from '../Navbar'
import { Container, Box } from '@mui/material'
import styles from './Main.module.css'
import getTranslation from '../../../locales/getTranslation'

export default function Main({ children }) {

    const router = useRouter();
    const [sidemenuOpen, setSidemenuOpen] = useState(false)

    const t = getTranslation()

    if (router.pathname.includes('/login')) return children;

    return (
        <>
            <Head>
                <title>{t['app.title']}</title>
            </Head>
            <Navbar
                setSidemenuOpen={setSidemenuOpen}
            />
            <SideMenu
                sidemenuOpen={sidemenuOpen}
                setSidemenuOpen={setSidemenuOpen}
            />
            <Box className={styles.mainContainer}>
                <Container maxWidth={false} className={styles.container}>
                    {children}
                </Container>
            </Box>
        </>
    )
}