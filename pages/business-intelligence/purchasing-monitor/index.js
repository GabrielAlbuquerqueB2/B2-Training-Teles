import { useState } from 'react'
import { Box } from '@mui/material'
import PageHeader from '../../../components/ui/PageHeader'
import getTranslation from '../../../locales/getTranslation'
import PurchasingMonitorGrid from '../../../features/business-intelligence/purchasing-monitor/PurchasingMonitorGrid'


export default function PurchasingMonitor() {

    const t = getTranslation()

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <PageHeader
                    title={t["app.business-intelligence.purchasing-monitor"]}
                />
                <PurchasingMonitorGrid />
            </Box>
        </>
    )
}