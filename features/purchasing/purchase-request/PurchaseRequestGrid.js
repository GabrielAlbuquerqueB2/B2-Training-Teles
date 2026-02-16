import { useState } from 'react'
import { Table, Box, Grid, TableCell, TableRow, TableHead, TableBody, Button, TextField, Tooltip, CircularProgress } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import CurrencyTextField from '../../../components/ui/CurrencyTextField/CurrencyTextField'
import ItemAutocomplete from '../../../components/ui/Autocomplete/ItemAutocompleteByGroupCode'
import WarehouseByBranchSelect from '../../../components/ui/Select/WarehousesByBranchSelect'
import { createAlternateCatNum } from './PurchaseRequestServices'

export default function PurchaseRequestGrid(props) {

    const [savingIndex, setSavingIndex] = useState(null)

    function handleLineBlur(index) {
        const lastIndex = props.data.DocumentLines.length - 1
        if (props.data.DocumentLines[lastIndex]?.Quantity) {
            props.handleNewLine()
        }
    }

    function getRowBackgroundColor(item) {
        if (item.catalogCreated || item.xmlMatchStatus === 'vinculado') return '#E8F5E9'
        if (item.xmlMatchStatus === 'nao_encontrado') return '#FFEBEE'
        return undefined
    }

    function showLinkButton(item) {
        return item.xmlMatchStatus === 'nao_encontrado'
            && item.Item?.id
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
                                <TableCell>Item</TableCell>
                                <TableCell>Desc. Complementar</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Depósito</TableCell>
                                <TableCell>Preço Unitário</TableCell>
                                <TableCell>Vincular</TableCell>
                                <TableCell>Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                props.data.DocumentLines ?
                                    props.data.DocumentLines?.map((item, index) => {
                                        return (
                                            <TableRow sx={{ backgroundColor: getRowBackgroundColor(item) }}>
                                                <TableCell width="8%" sx={{ padding: '3px' }}>
                                                    <TextField
                                                        type="text"
                                                        value={props.data.DocumentLines[index]?.VendorItemCode ?? ''}
                                                        InputProps={{ readOnly: true }}
                                                        placeholder="-"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell width="15%" sx={{ padding: '3px' }}>
                                                    <TextField
                                                        type="text"
                                                        value={props.data.DocumentLines[index]?.XmlDescription ?? ''}
                                                        InputProps={{ readOnly: true }}
                                                        placeholder="-"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell width="18%" sx={{ padding: '3px' }}>
                                                    <Tooltip
                                                        title={item.xmlMatchStatus === 'nao_encontrado' ? 'Item não encontrado no catálogo do fornecedor' : ''}
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
                                                                }}
                                                            />
                                                        </div>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell width="13%" sx={{ padding: '3px' }}>
                                                    <TextField
                                                        type="text"
                                                        value={props.data.DocumentLines[index]?.FreeText}
                                                        onChange={evt => props.setChildField('DocumentLines', 'FreeText', index, evt.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell width="12%" sx={{ padding: '3px' }}>
                                                    <CurrencyTextField
                                                        value={props.data.DocumentLines[index]?.Quantity}
                                                        onChange={(evt, newValue) => {
                                                            props.setChildField('DocumentLines', 'Quantity', index, newValue)
                                                        }}
                                                        onBlur={() => { handleLineBlur(index) }}
                                                    />
                                                </TableCell>
                                                <TableCell width= "12%" sx={{ padding: '3px' }}>
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
                                                <TableCell width="12%" sx={{ padding: '3px' }}>
                                                    <CurrencyTextField
                                                        value={props.data.DocumentLines[index]?.UnitPrice}
                                                        onChange={(evt, newValue) => {
                                                            props.setChildField('DocumentLines', 'UnitPrice', index, newValue)
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell width="5%" sx={{ padding: '3px' }}>
                                                    {showLinkButton(item) ? (
                                                        <Tooltip title="Vincular item ao catálogo do fornecedor" arrow>
                                                            <span>
                                                                <Button
                                                                    variant='outlined'
                                                                    color='primary'
                                                                    onClick={() => handleCreateLink(item, index)}
                                                                    disabled={savingIndex === index}
                                                                    size='small'
                                                                >
                                                                    {savingIndex === index ? <CircularProgress size={20} /> : <LinkIcon />}
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    ) : null}
                                                </TableCell>
                                                <TableCell width="5%" sx={{ padding: '3px' }}>
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