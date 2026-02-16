import { useState } from 'react'
import { Table, Box, Grid, TableCell, TableRow, TableHead, TableBody, Button, TextField, Tooltip, CircularProgress } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import CurrencyTextField from '../../../components/ui/CurrencyTextField/CurrencyTextField'
import ItemAutocomplete from '../../../components/ui/Autocomplete/ItemAutocompleteByGroupCode'
import WarehouseByBranchSelect from '../../../components/ui/Select/WarehousesByBranchSelect'
import { createAlternateCatNum } from './PurchaseRequestServices'

const GENERIC_ITEM_CODE = 'GENERICO'

export default function PurchaseRequestGrid(props) {

    const [savingIndex, setSavingIndex] = useState(null)

    function handleLineBlur(index) {
        const lastIndex = props.data.DocumentLines.length - 1
        if (props.data.DocumentLines[lastIndex]?.Quantity) {
            props.handleNewLine()
        }
    }

    function getRowBackgroundColor(item) {
        if (item.xmlMatchStatus === 'generic') return '#E3F2FD'
        if (item.catalogCreated || item.xmlMatchStatus === 'vinculado') return '#E8F5E9'
        if (item.xmlMatchStatus === 'nao_encontrado') return '#FFEBEE'
        return undefined
    }

    function showLinkButton(item) {
        return !!item.VendorItemCode
    }

    function isLinkEnabled(item) {
        return item.xmlMatchStatus === 'nao_encontrado'
            && item.Item?.id
            && item.Item?.id !== GENERIC_ITEM_CODE
            && item.VendorItemCode
            && props.vendor?.id
            && !item.catalogCreated
    }

    async function handleCreateLink(item, index) {
        setSavingIndex(index)
        try {
            await createAlternateCatNum(props.vendor.id, item.VendorItemCode, item.Item.id)
            props.setChildField('DocumentLines', 'xmlMatchStatus', index, 'vinculado')
            props.setChildField('DocumentLines', 'catalogCreated', index, true)
            props.setAlert({ visible: true, type: 'success', message: 'Vínculo criado com sucesso no catálogo do fornecedor.' })
        } catch (error) {
            const msg = error.response?.data?.error || 'Erro ao criar vínculo.'
            props.setAlert({ visible: true, type: 'error', message: msg })
        } finally {
            setSavingIndex(null)
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Cód. Item XML</TableCell>
                                <TableCell>Desc. Item XML</TableCell>
                                <TableCell>Vincular</TableCell>
                                <TableCell>Item</TableCell>
                                <TableCell>Desc. Complementar</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Depósito</TableCell>
                                <TableCell>Preço Unitário</TableCell>
                                <TableCell>Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                props.data.DocumentLines ?
                                    props.data.DocumentLines?.map((item, index) => {
                                        return (
                                            <TableRow sx={{ backgroundColor: getRowBackgroundColor(item) }}>
                                                <TableCell width="7%" sx={{ padding: '3px' }}>
                                                    <TextField
                                                        type="text"
                                                        value={props.data.DocumentLines[index]?.VendorItemCode ?? ''}
                                                        InputProps={{ readOnly: true }}
                                                        placeholder="-"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell width="17%" sx={{ padding: '3px' }}>
                                                    <TextField
                                                        type="text"
                                                        value={props.data.DocumentLines[index]?.XmlDescription ?? ''}
                                                        InputProps={{ readOnly: true }}
                                                        placeholder="-"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell width="3%" sx={{ padding: '3px' }}>
                                                    {showLinkButton(item) ? (
                                                        <Tooltip title="Vincular item ao catálogo do fornecedor" arrow>
                                                            <span>
                                                                <Button
                                                                    variant='outlined'
                                                                    color='primary'
                                                                    onClick={() => handleCreateLink(item, index)}
                                                                    disabled={!isLinkEnabled(item) || savingIndex === index}
                                                                    size='small'
                                                                    sx={{ minHeight: '40px', width: '100%' }}
                                                                >
                                                                    {savingIndex === index ? <CircularProgress size={20} /> : <LinkIcon />}
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    ) : null}
                                                </TableCell>
                                                <TableCell width="17%" sx={{ padding: '3px' }}>
                                                    <Tooltip
                                                        title={
                                                            item.xmlMatchStatus === 'generic'
                                                                ? 'Item genérico — descrição XML aplicada'
                                                                : ''
                                                        }
                                                        arrow
                                                    >
                                                        <div>
                                                            <ItemAutocomplete
                                                                name="Item"
                                                                itemGroup={props.data.ItemGroup}
                                                                value={props.data.DocumentLines[index]?.Item}
                                                                setValue={(newValue) => {
                                                                    props.setChildField('DocumentLines', 'Item', index, newValue)
                                                                    props.setChildField('DocumentLines', 'UoMEntry', index, newValue?.UoMEntry || null)
                                                                    if (newValue?.id === GENERIC_ITEM_CODE) {
                                                                        props.setChildField('DocumentLines', 'FreeText', index, item.XmlDescription || '')
                                                                        props.setChildField('DocumentLines', 'xmlMatchStatus', index, 'generic')
                                                                        props.setChildField('DocumentLines', 'catalogCreated', index, true)
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell width="17%" sx={{ padding: '3px' }}>
                                                    <TextField
                                                        type="text"
                                                        value={props.data.DocumentLines[index]?.FreeText}
                                                        onChange={evt => props.setChildField('DocumentLines', 'FreeText', index, evt.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell width="8%" sx={{ padding: '3px' }}>
                                                    <CurrencyTextField
                                                        value={props.data.DocumentLines[index]?.Quantity}
                                                        onChange={(evt, newValue) => {
                                                            props.setChildField('DocumentLines', 'Quantity', index, newValue)
                                                        }}
                                                        onBlur={() => { handleLineBlur(index) }}
                                                    />
                                                </TableCell>
                                                <TableCell width="10%" sx={{ padding: '3px' }}>
                                                    <WarehouseByBranchSelect
                                                        index={index}
                                                        name="WarehouseCode"
                                                        //label="Depósito"
                                                        father="DocumentLines"
                                                        value={props.data.DocumentLines[index]?.WarehouseCode}
                                                        setState={props.setChildField}
                                                        branch={props.data.BPL_IDAssignedToInvoice}
                                                    />
                                                </TableCell>
                                                <TableCell width="8%" sx={{ padding: '3px' }}>
                                                    <CurrencyTextField
                                                        value={props.data.DocumentLines[index]?.UnitPrice}
                                                        onChange={(evt, newValue) => {
                                                            props.setChildField('DocumentLines', 'UnitPrice', index, newValue)
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell width="3%" sx={{ padding: '3px' }}>
                                                    <Button
                                                        variant='outlined'
                                                        onClick={() => { props.handleDeleteLine(index) }}
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                    : null
                            }
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </Box>
    )

}