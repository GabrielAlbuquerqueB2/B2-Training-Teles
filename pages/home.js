import PageHeader from '../components/ui/PageHeader'
import getTranslation from '../locales/getTranslation'

export default function Home() {

    const t = getTranslation()

    return (
        <>
            <PageHeader
                title={t["app.home.title"]}
            />
      
        </>
    )
}