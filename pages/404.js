import { useRouter } from 'next/router'
import Image from 'next/image'
import { Grid, Button } from '@mui/material'
import PageHeader from '../components/ui/PageHeader'
import error404 from '../public/images/error-404.png'
import getTranslation from '../locales/getTranslation'

export default function FourOhFour() {

  const router = useRouter()

  const t = getTranslation()

  return <>
    <PageHeader
      title={"Página não encontrada"}
    />
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '60vh' }}
    >

      <Grid item xs={3}>
        <Image
          src={error404}
          width={300}
          height={300}
          alt="404"
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          onClick={() => {
            router.push('/home')
          }}
        >
          {t['app.404.back.btn']}
        </Button>
      </Grid>

    </Grid>

  </>
}