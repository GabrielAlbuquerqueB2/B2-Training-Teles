import Head from 'next/head'
import { Paper } from '@mui/material'
import Login from '../components/Layout/Login'
import styles from '../components/Layout/Login/MainLogin.module.css'
import getTranslation from '../locales/getTranslation'

export default function LoginPage() {

  const t = getTranslation()

  return (
    <>
      <Head>
        <title>{t['app.title']}</title>
      </Head>
      <Paper className={styles.paper}>
        <Paper className={styles.loginPaper}>
          <Login />
        </Paper>
      </Paper>
    </>
  )
}
