import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../../../components/ui/PageHeader'
import Tabs from '../../../components/ui/Tabs'
import AlertMessage from '../../../components/ui/AlertMessage'
import BusinessPartnersHeader from '../../../features/business/partners/BusinessPartnersHeader'
import BusinessPartnersGrid from '../../../features/business/partners/BusinessPartnersGrid'
import BusinessPartnersAddresses from '../../../features/business/partners/BusinessPartnersAddresses'
import BusinessPartnersContacts from '../../../features/business/partners/BusinessPartnersContacts'
import BusinessPartnersActions from '../../../features/business/partners/BusinessPartnersActions'
import { getBusinessPartnerById } from '../../../features/business/partners/BusinessPartnersServices'
import { getDefaultData, getDefaultAddress, getDefaultContact } from '../../../features/business/partners/BusinessPartnersModel'
import { Box } from '@mui/material'

export default function BusinessPartner() {
    const router = useRouter()
    const id = router.query.id

    const [data, setData] = useState(getDefaultData())
    const [status, setStatus] = useState('CREATE')
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
    const [currentTab, setCurrentTab] = useState(1)

    useEffect(() => {
        async function fetchData() {
            if (id === 'new') {
                const defaultData = getDefaultData()
                setData({ ...defaultData })
                setStatus('CREATE')
            } else if (id) {
                const result = await getBusinessPartnerById(id)
                if (result) {
                    let addresses = result.BPAddresses && Array.isArray(result.BPAddresses)
                        ? result.BPAddresses.map(address => ({
                            ...address,
                            AddressType: address.AddressType || 'bo_BillTo',
                            CountyCode: address.County || ''
                        }))
                        : []

                    if (addresses.length === 0) {
                        addresses = [
                            { ...getDefaultAddress(), AddressName: 'COM', AddressType: 'bo_BillTo' },
                            { ...getDefaultAddress(), AddressName: 'ENT', AddressType: 'bo_ShipTo' }
                        ]
                    } else if (addresses.length === 1) {
                        const hasCommercial = addresses.some(addr => addr.AddressType === 'bo_BillTo')
                        if (hasCommercial) {
                            addresses.push({ ...getDefaultAddress(), AddressName: 'ENT', AddressType: 'bo_ShipTo' })
                        } else {
                            addresses.unshift({ ...getDefaultAddress(), AddressName: 'COM', AddressType: 'bo_BillTo' })
                        }
                    }

                    let contacts = result.ContactEmployees && Array.isArray(result.ContactEmployees)
                        ? result.ContactEmployees.map(contact => ({
                            ...contact,
                            Active: contact.Active || 'Y'
                        }))
                        : []

                    if (contacts.length === 0) {
                        contacts = [getDefaultContact()]
                    }

                    let fiscalTaxCollection = result.BPFiscalTaxIDCollection && Array.isArray(result.BPFiscalTaxIDCollection)
                        ? result.BPFiscalTaxIDCollection
                        : []

                    console.log('=== DEBUG: Dados recebidos do SAP ===')
                    console.log('BPFiscalTaxIDCollection:', JSON.stringify(fiscalTaxCollection, null, 2))

                    const cardTypeFinal = result.CardType === 'C' ? 'cCustomer' : result.CardType === 'S' ? 'cSupplier' : result.CardType || '';
                    setData({
                        ...result,
                        BPAddresses: addresses,
                        ContactEmployees: contacts,
                        BPFiscalTaxIDCollection: fiscalTaxCollection,
                        DocumentStatus: result.DocumentStatus,
                        FederalTaxID: result.FederalTaxID || '',
                        CardCode: result.CardCode || '',
                        CardName: result.CardName || '',
                        CardType: cardTypeFinal,
                        Series: result.Series || 70
                    })
                    setStatus('EDIT')
                }
            }
        }
        if (id) {
            fetchData().catch(error => console.error('Erro ao carregar dados:', error))
        }
    }, [id])

    function setField(field, newValue) {
        setData(prevData => ({
            ...prevData,
            [field]: newValue
        }))
    }

    function setChildField(father, field, index, newValue) {
        setData(prevData => {
            const newFatherArray = [...prevData[father]]
            newFatherArray[index] = { ...newFatherArray[index], [field]: newValue }
            return { ...prevData, [father]: newFatherArray }
        })
    }

    function handleNewAddress(addressType) {
        const newAddress = {
            ...getDefaultAddress(),
            AddressType: addressType
        }
        setData(prevData => ({
            ...prevData,
            BPAddresses: [...(prevData.BPAddresses || []), newAddress]
        }))
    }

    function handleDeleteAddress(index) {
        if (!data.BPAddresses || data.BPAddresses.length <= 2) return
        setData(prevData => ({
            ...prevData,
            BPAddresses: prevData.BPAddresses.filter((_, i) => i !== index)
        }))
    }

    function handleNewContact() {
        setData(prevData => ({
            ...prevData,
            ContactEmployees: [...(prevData.ContactEmployees || []), getDefaultContact()]
        }))
    }

    function handleDeleteContact(index) {
        if (!data.ContactEmployees || data.ContactEmployees.length <= 1) return
        setData(prevData => ({
            ...prevData,
            ContactEmployees: prevData.ContactEmployees.filter((_, i) => i !== index)
        }))
    }

    return (
        <>
            <PageHeader
                title="Parceiro de Negócios"
            />
            <Tabs>
                <Box
                    index={1}
                    label="Dados Gerais"
                    component={<>
                        <BusinessPartnersHeader
                            data={data}
                            status={status}
                            setField={setField}
                            onCardTypeChange={async (series, cardType) => {
                            }}
                        />
                        <BusinessPartnersGrid
                            data={data}
                            setField={setField}
                            setChildField={setChildField}
                            status={status}
                            onMount={() => setCurrentTab(1)}
                        />
                    </>}
                />
                <Box
                    index={2}
                    label="Endereços"
                    component={<>
                        <BusinessPartnersAddresses
                            data={data}
                            setField={setField}
                            setChildField={setChildField}
                            handleDeleteAddress={handleDeleteAddress}
                            status={status}
                            onMount={() => setCurrentTab(2)}
                        />
                    </>}
                />
                <Box
                    index={3}
                    label="Contatos"
                    component={<>
                        <BusinessPartnersContacts
                            data={data}
                            setField={setField}
                            setChildField={setChildField}
                            handleDeleteContact={handleDeleteContact}
                            status={status}
                            onMount={() => setCurrentTab(3)}
                        />
                    </>}
                />
            </Tabs>

            <br />
            <br />
            <BusinessPartnersActions
                data={data}
                router={router}
                status={status}
                setAlert={setAlert}
                currentTab={currentTab}
                handleNewAddress={handleNewAddress}
                handleNewContact={handleNewContact}
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