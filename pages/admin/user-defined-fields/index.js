import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box } from '@mui/material'
import PageHeader from '../../../components/ui/PageHeader'
import Tabs from '../../../components/ui/Tabs'
import { getSessionData } from '../../../utils/frontEndGetSessionData'
import userDefinedFieldsList from '../../../features/admin/user-defined-fields/UserDefinedFieldsList'
import UserDefinedFieldsGrid from '../../../features/admin/user-defined-fields/UserDefinedFieldsGrid'
import userDefinedTablesList from '../../../features/admin/user-defined-tables/UserDefinedTablesList'
import UserDefinedTablesGrid from '../../../features/admin/user-defined-tables/UserDefinedTablesGrid'
import userDefinedObjectsList from '../../../features/admin/user-defined-objects/UserDefinedObjectsList'
import UserDefinedObjectsGrid from '../../../features/admin/user-defined-objects/UserDefinedObjectsGrid'
import getTranslation from '../../../locales/getTranslation'

export default function UserDefinedFields() {

    const router = useRouter()
    const t = getTranslation()

    const [fields, setFields] = useState(userDefinedFieldsList)
    const [tables, setTables] = useState(userDefinedTablesList)
    const [objs, setObjs] = useState(userDefinedObjectsList)

    useEffect(() => {

        const sessionData = getSessionData()
        if (sessionData) {
            const userName = JSON.parse(sessionData).user
            if (userName !== 'manager') {
                router.push('/home')
            }
        }
    }, [router])

    return (
        <>
            <PageHeader
                title={t["app.admin.user-defined-fields.title"]}
            />
            <Tabs>
                <Box
                    index={1}
                    label="Tables"
                    component={
                        <UserDefinedTablesGrid 
                            data={tables}
                        />
                    }
                />
                <Box
                    index={2}
                    label="Fields"
                    component={
                        <UserDefinedFieldsGrid
                            data={fields}
                        />
                    }
                />
                <Box
                    index={3}
                    label="Objects"
                    component={
                        <UserDefinedObjectsGrid
                            data={objs}
                        />
                    }
                />
            </Tabs>

        </>
    )
}