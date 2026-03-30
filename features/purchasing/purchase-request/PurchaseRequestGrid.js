import { useState, useEffect } from 'react'
import { Table, Box, Grid, TableCell, TableRow, TableHead, TableBody, Button, TextField, Tooltip, CircularProgress, Select, MenuItem } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import CurrencyTextField from '../../../components/ui/CurrencyTextField/CurrencyTextField'
import ItemAutocomplete from '../../../components/ui/Autocomplete/ItemAutocompleteByGroupCode'
import WarehouseByBranchSelect from '../../../components/ui/Select/WarehousesByBranchSelect'
import { createAlternateCatNum } from './PurchaseRequestServices'
import axios from 'axios'

const GENERIC_ITEM_CODE = 'GENERICO'

// ─── NOVO: componente de Select de Unidade de Medida ─────────────────────────
function UomSelect({ item, value, uomGroups, uoms, onChange }) {
    if (!item) {
        return (
            <Select value="" displayEmpty size="small" fullWidth disabled>
                <MenuItem value=""><em>Selecione</em></MenuItem>
            </Select>
        )
    }

    const group = uomGroups.find(g => g.UgpEntry === item?.UoMGroupEntry)

    const validUoms = group?.UoMGroupDefinitionCollection?.map(u => {
        const uom = uoms.find(x => x.AbsEntry === u.AlternateUoM)
        return uom ? { code: uom.UomCode, name: uom.Name, absEntry: uom.AbsEntry } : null
    }).filter(Boolean) || []

    // Fallback: se não encontrar opções no grupo, usa o InventoryUOM do item
    const options = validUoms.length > 0
        ? validUoms
        : item.InventoryUOM
            ? [{ code: item.InventoryUOM, name: item.InventoryUOM, absEntry: item.InventoryUOM }]
            : []

    // 🔍 DEBUG — remover após validação
    console.log('[UomSelect] UoMGroupEntry:', item?.UoMGroupEntry, '→ grupo:', group, '→ opções:', options)

    return (
        <Select
            value={value || ''}
            onChange={evt => onChange(evt.target.value)}
            displayEmpty
            size="small"
            fullWidth
            disabled={options.length === 0}
        >
            <MenuItem value=""><em>Selecione</em></MenuItem>
            {options.map(u => (
                <MenuItem key={u.absEntry ?? u.code} value={u.code}>
                    {u.name} ({u.code})
                </MenuItem>
            ))}
        </Select>
    )
}
// ─────────────────────────────────────────────────────────────────────────────

export default function PurchaseRequestGrid(props) {

    const [savingIndex, setSavingIndex] = useState(null)

    // ─── NOVO: estados para grupos e unidades de medida ──────────────────────
    const [uomGroups, setUomGroups] = useState([])
    const [uoms, setUoms] = useState([])

    useEffect(() => {
        async function fetchUoMData() {
            try {
                const [groupsRes, uomsRes] = await Promise.all([
                    axios.get('/UnitOfMeasurementGroups'),
                    axios.get('/UnitOfMeasurements')
                ])
                const groups = groupsRes.data.value || groupsRes.data
                const allUoms = uomsRes.data.value || uomsRes.data

                // 🔍 DEBUG — remover após validação
                console.log('[UoM] Exemplo de grupo:', groups[0])
                console.log('[UoM] Chaves do grupo:', groups[0] ? Object.keys(groups[0]) : [])
                console.log('[UoM] Exemplo de UM:', allUoms[0])

                setUomGroups(groups)
                setUoms(allUoms)
            } catch (e) {
                console.error('[UoM] Erro ao buscar Unidades de Medida:', e)
            }
        }
        fetchUoMData()
    }, [])
    // ─────────────────────────────────────────────────────────────────────────

    const showXmlColumns = props.data.DocumentLines?.some(item => item.VendorItemCode || item.XmlDescription)

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
            const msg = error.message || 'Erro ao criar vínculo.'
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
                                {showXmlColumns && <TableCell>Cód. Item XML</TableCell>}
                                {showXmlColumns && <TableCell>Desc. Item XML</TableCell>}
                                {showXmlColumns && <TableCell>Vincular</TableCell>}
                                <TableCell>Item</TableCell>
                                <TableCell>Desc. Complementar</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Unidade de Medida</TableCell>  {/* ← adicionado header */}
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
                                            <TableRow key={index} sx={{ backgroundColor: getRowBackgroundColor(item) }}>  {/* ← adicionado key */}
                                                {showXmlColumns && (
                                                    <TableCell width="6.8%" sx={{ padding: '3px' }}>
                                                        <TextField
                                                            type="text"
                                                            value={props.data.DocumentLines[index]?.VendorItemCode ?? ''}
                                                            InputProps={{ readOnly: true }}
                                                            placeholder="-"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                )}
                                                {showXmlColumns && (
                                                    <TableCell width="18%" sx={{ padding: '3px' }}>
                                                        <TextField
                                                            type="text"
                                                            value={props.data.DocumentLines[index]?.XmlDescription ?? ''}
                                                            InputProps={{ readOnly: true }}
                                                            placeholder="-"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                )}
                                                {showXmlColumns && (
                                                    <TableCell width="3%" sx={{ padding: '3px' }}>
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
                                                    </TableCell>
                                                )}
                                                <TableCell width={showXmlColumns ? "20%" : "25%"} sx={{ padding: '3px' }}>
                                                    <div>
                                                        <ItemAutocomplete
                                                            name="Item"
                                                            itemGroup={props.data.ItemGroup}
                                                            value={props.data.DocumentLines[index]?.Item}
                                                            setValue={(newValue) => {
                                                                props.setChildField('DocumentLines', 'Item', index, newValue)
                                                                props.setChildField('DocumentLines', 'UoMEntry', index, newValue?.InventoryUOM || null)
                                                                if (newValue?.id === GENERIC_ITEM_CODE) {
                                                                    const ncmText = item.XmlNCM ? ` | NCM: ${item.XmlNCM}` : ''
                                                                    props.setChildField('DocumentLines', 'FreeText', index, (item.XmlDescription || '') + ncmText)
                                                                    props.setChildField('DocumentLines', 'xmlMatchStatus', index, 'generic')
                                                                    props.setChildField('DocumentLines', 'catalogCreated', index, true)
                                                                } else if (item.VendorItemCode && (item.xmlMatchStatus === 'generic' || item.catalogCreated)) {
                                                                    props.setChildField('DocumentLines', 'xmlMatchStatus', index, 'nao_encontrado')
                                                                    props.setChildField('DocumentLines', 'catalogCreated', index, false)
                                                                    props.setChildField('DocumentLines', 'FreeText', index, '')
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell width={showXmlColumns ? "18%" : "25%"} sx={{ padding: '3px' }}>
                                                    <TextField
                                                        type="text"
                                                        value={props.data.DocumentLines[index]?.FreeText}
                                                        onChange={evt => props.setChildField('DocumentLines', 'FreeText', index, evt.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell width={showXmlColumns ? "8%" : "15%"} sx={{ padding: '3px' }}>
                                                    <CurrencyTextField
                                                        value={props.data.DocumentLines[index]?.Quantity}
                                                        onChange={(evt, newValue) => {
                                                            props.setChildField('DocumentLines', 'Quantity', index, newValue)
                                                        }}
                                                        onBlur={() => { handleLineBlur(index) }}
                                                    />
                                                </TableCell>

                                                {/* ─── NOVO: célula de Unidade de Medida ───────────────────────── */}
                                                <TableCell width={showXmlColumns ? "8%" : "10%"} sx={{ padding: '3px' }}>
                                                    <UomSelect
                                                        item={props.data.DocumentLines[index]?.Item}
                                                        value={props.data.DocumentLines[index]?.UoMEntry}
                                                        uomGroups={uomGroups}
                                                        uoms={uoms}
                                                        onChange={newCode =>
                                                            props.setChildField('DocumentLines', 'UoMEntry', index, newCode)
                                                        }
                                                    />
                                                </TableCell>
                                                {/* ──────────────────────────────────────────────────────────── */}

                                                <TableCell width={showXmlColumns ? "12%" : "16%"} sx={{ padding: '3px' }}>
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
                                                <TableCell width={showXmlColumns ? "8%" : "15%"} sx={{ padding: '3px' }}>
                                                    <CurrencyTextField
                                                        value={props.data.DocumentLines[index]?.UnitPrice}
                                                        onChange={(evt, newValue) => {
                                                            props.setChildField('DocumentLines', 'UnitPrice', index, newValue)
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell width={showXmlColumns ? "3%" : "5%"} sx={{ padding: '3px' }}>
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