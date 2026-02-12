import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box } from '@mui/material'
import getTranslation from '../../../../locales/getTranslation'
import PageHeader from '../../../../components/ui/PageHeader'
import ProductionAnalisysHeader from '../../../../features/agricultural/field-control/production-analisys/ProductionAnalisysHeader'
import ProductionAnalisysActions from '../../../../features/agricultural/field-control/production-analisys/ProductionAnalisysActions'
import { getProductionAnalisysById, getProductionUnitByCode } from '../../../../features/agricultural/field-control/production-analisys/ProductionAnalisysServices'
import AlertMessage from '../../../../components/ui/AlertMessage'
import { getYearMonthDateFormat } from '../../../../utils/formatDate'

export default function ProductionAnalisys() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({})
    const [status, setStatus] = useState('CREATE')
    const [fields, setFields] = useState([])
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

    useEffect(() => {
        async function fetchData() {

            if (id !== 'new' && id) {
                const result = await getProductionAnalisysById(id)
                const fieldByUnit = await getProductionUnitByCode(result.U_B2AG_ProductionUnitCode, result.U_B2AG_Field)
                if (result) {
                    setFields(fieldByUnit.B2AG_PDU1Collection)
                    setData({
                        ...result,
                        U_B2AG_Date: getYearMonthDateFormat(result.U_B2AG_Date),
                        U_B2AG_TotalArea: fieldByUnit.field[0].U_B2AG_AreaHa
                    })
                    setStatus('EDIT')
                }
            } else {
                setStatus('CREATE')
            }
        }
        fetchData()
    }, [id])

    function setField(field, newValue) {
        let newData = { ...data }
        newData[field] = newValue
        setData(newData)
    }

    return (
        <>
            <PageHeader
                title={t["app.agricultural.field-control.production-analisys"]}
            />
            <ProductionAnalisysHeader
                data={data}
                id={id}
                fields={fields}
                setFields={setFields}
                setField={setField}
            />
            <br />
            <ProductionAnalisysActions
                data={data}
                status={status}
                setAlert={setAlert}
                router={router}
            />
            <Box hidden={!alert.visible}>
                <AlertMessage
                    alertOpen={alert.visible}
                    setAlertOpen={setAlert}
                    type={alert.type}
                    message={alert.message}
                />
            </Box>
        </>
    )
}