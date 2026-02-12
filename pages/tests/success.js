import { useState } from 'react'
import { Button, Typography } from "@mui/material"
import axios from 'axios'
import Api from '../../lib/api'

export default function Success() {

    const [text, setText] = useState('')

    async function handleSuccess(op) {

        const query = new Api()
            .setMethod('POST')
            .setUrl('/ProductionOrders')
            .setData(op)
            .get()

        try {
            let response = await axios(query)
            setText(JSON.stringify(response.data))
        } catch (error) {            
            setText(JSON.stringify(error.response.data))
        }

    }

    async function call() {

        const result = await handleSuccess({
            "DueDate": "2022-09-23",
            "ItemNo": "PA000001",
            "PlannedQuantity": 100
        })
    }

    return (
        <>
            <Button
                onClick={call}
            >
                Test
            </Button>
            <Typography>
                {text}
            </Typography>
        </>
    )
}