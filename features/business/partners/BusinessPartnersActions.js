import { useState } from 'react'
import { Stack, Button, Menu, MenuItem } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { Add, ArrowDropDown } from '@mui/icons-material'
import { createBusinessPartnerModel, editBusinessPartnerModel } from './BusinessPartnersModel'
import { createBusinessPartner, editBusinessPartner } from './BusinessPartnersServices'

export default function BusinessPartnersActions({ data, router, status, setAlert, currentTab, handleNewAddress, handleNewContact }) {
    const [isLoading, setIsLoading] = useState(false)
    const [addressMenuAnchor, setAddressMenuAnchor] = useState(null)

    async function handleSubmit() {
        setIsLoading(true)
        if (status === 'CREATE') {
            await handleBusinessPartnerCreation()
        } else {
            await handleBusinessPartnerEdit()
        }
        setIsLoading(false)
    }

    async function handleBusinessPartnerCreation() {
        try {
            const submitData = createBusinessPartnerModel(data)
            const response = await createBusinessPartner(submitData)
            const generatedCardCode = response?.CardCode

            if (generatedCardCode) {
                setAlert({
                    visible: true,
                    type: "success",
                    message: `Parceiro de negócio criado com sucesso! Código: ${generatedCardCode}`
                })
                setTimeout(() => {
                    router.push(`/business/partners/${generatedCardCode}`)
                }, 3000)
            } else {
                setAlert({ visible: true, type: "warning", message: `Operação enviada, mas o código do parceiro não foi retornado.` })
            }
        } catch (error) {
            const errorMessage = error?.error?.message?.value || error?.message || 'Erro ao criar parceiro de negócio.'
            setAlert({ visible: true, type: "error", message: errorMessage })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleBusinessPartnerEdit() {
        try {
            const submitData = editBusinessPartnerModel(data)
            await editBusinessPartner(data.CardCode, submitData)
            setAlert({ visible: true, type: "success", message: `Parceiro de negócio atualizado com sucesso` })
            setTimeout(() => {
                router.push('/business/partners/list')
            }, 3000)
        } catch (error) {
            const errorMessage = error?.error?.message?.value || error?.message || 'Erro ao atualizar parceiro.'
            setAlert({ visible: true, type: "error", message: errorMessage })
        } finally {
            setIsLoading(false)
        }
    }

    function handleAddressMenuClick(event) {
        setAddressMenuAnchor(event.currentTarget)
    }

    function handleAddressMenuClose() {
        setAddressMenuAnchor(null)
    }

    function handleAddressTypeSelect(addressType) {
        handleNewAddress(addressType)
        handleAddressMenuClose()
    }

    return (
        <>
            <Stack direction="row" spacing={2}>
                <LoadingButton
                    loading={isLoading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={status === 'CREATE' && !data.Series}
                >
                    {status === 'CREATE' ? 'ADICIONAR' : 'ATUALIZAR'}
                </LoadingButton>
                {currentTab === 2 && (
                    <>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            endIcon={<ArrowDropDown />}
                            onClick={handleAddressMenuClick}
                        >
                            ADICIONAR ENDEREÇO
                        </Button>
                        <Menu
                            anchorEl={addressMenuAnchor}
                            open={Boolean(addressMenuAnchor)}
                            onClose={handleAddressMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <MenuItem onClick={() => handleAddressTypeSelect('bo_BillTo')}>
                                Endereço de Cobrança
                            </MenuItem>
                            <MenuItem onClick={() => handleAddressTypeSelect('bo_ShipTo')}>
                                Endereço de Entrega
                            </MenuItem>
                        </Menu>
                    </>
                )}
                {currentTab === 3 && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleNewContact}
                    >
                        ADICIONAR CONTATO
                    </Button>
                )}
                <Button
                    variant="outlined"
                    onClick={() => router.push('/business/partners/list')}
                >
                    VOLTAR À LISTA
                </Button>
            </Stack>
            <br />
        </>
    )
}