import { useState, useEffect } from 'react'
import { Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { getAdditionalExpenses } from './PurchaseDeliveryNotesServices'
import CurrencyTextField from '../../../components/ui/CurrencyTextField'

export default function AditionalExpenses({isExpesesDialogOpen, handleExpensesDialogClose, expenses, setExpenses, status}) {

    const [additionalExpenses, setAdditionalExpenses] = useState([])

    useEffect(() => {
        async function fetchData() {
            const exp = await getAdditionalExpenses()
            setAdditionalExpenses(exp)
        }
        fetchData()
    },[])

    function handleExpensesChange(code, value, index) {
        let newExpenses = [ ...expenses ]
        newExpenses[index] = {
            ExpenseCode: code,
            LineTotal: value
        }
        setExpenses(newExpenses)
    }

    return (
        <>
            <Dialog open={isExpesesDialogOpen} onClose={handleExpensesDialogClose}>
                <DialogTitle id="form-dialog-title">Despesas Adicionais</DialogTitle>
                <DialogContent>
                    <Grid container>
                        {additionalExpenses?.map((expense, index) => {
                            return (
                                <Grid item xs={12} style={{padding: 10}}>
                                    <CurrencyTextField
                                        id={expense.Name}
                                        variant="outlined"
                                        currencySymbol="R$"
                                        decimalCharacter=","
                                        digitGroupSeparator="."
                                        minimumValue="0"
                                        placeholder="R$ 0,00"
                                        label={expense.Name}
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={expenses[index]?.LineTotal}
                                        onChange={(event, value) => {
                                            handleExpensesChange(expense.ExpensCode, value, index)
                                        }}
                                        disabled={status === 'UPDATE'}
                                    />
                                </Grid>
                            );
                        })}

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleExpensesDialogClose} color="primary">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}