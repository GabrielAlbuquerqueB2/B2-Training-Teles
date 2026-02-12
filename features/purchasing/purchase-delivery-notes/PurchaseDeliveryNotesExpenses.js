import { useState } from 'react'
import { Button } from '@mui/material';
import AdditionalExpenses from './AdditionalExpenses';

export default function PurchaseDeliveryNotesExpenses(props) {

    const [isExpesesDialogOpen, setIsExpenseDialogOpen] = useState(false)

    function handleExpensesDialogClose() {
        setIsExpenseDialogOpen(false)
    }

    return (
        <>
            <Button
                onClick={() => {
                    setIsExpenseDialogOpen(true)
                }}
            >
                Despesas Adicionais
            </Button>            
            <AdditionalExpenses
                isExpesesDialogOpen={isExpesesDialogOpen}
                handleExpensesDialogClose={handleExpensesDialogClose}
                expenses={props.expenses}
                setExpenses={props.setExpenses}
                status={props.status}
            />
        </>
    )
}