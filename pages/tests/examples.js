import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import getTranslation from '../../locales/getTranslation'
import { Box, TextField, Typography, Divider, Button } from '@mui/material'
import Tabs from '../../components/ui/Tabs'
import Select from '../../components/ui/Select'
import ItemAutocomplete from '../../components/ui/Autocomplete/ItemAutocomplete'

export default function Examples() {

    const t = getTranslation()

    const [textFieldValue, setTextFieldValue] = useState('')

    const [selectValue, setSelectValue] = useState('')
    const [selectList, setSelectList] = useState([
        { value: '1', description: 'Valor 1' },
        { value: '2', description: 'Valor 2' },
        { value: '3', description: 'Valor 3' },
        { value: '4', description: 'Valor 4' },
    ])

    const [autocompleteValue, setAutocompleteValue] = useState('');
    const [autocompleteInList, setAutocompleteInList] = useState({
        DocNum: 10,
        DocumentLines: [
            { Item: '' },
        ]
    })

    function setChildField(father, field, index, newValue) {
        let newData = { ...autocompleteInList }
        newData[father][index][field] = newValue
        setAutocompleteInList(newData)
    }

    function handleNewLine() {
        let newData = { ...autocompleteInList }
        newData.DocumentLines.push({ Item: '' })
        setAutocompleteInList(newData)
    }

    function handleDeleteLine(index) {
        if(autocompleteInList.DocumentLines.length <= 1) return;
        let newData = { ...autocompleteInList }
        newData.DocumentLines.splice(index, 1)
        setAutocompleteInList(newData)
    }

    return (
        <>
            <PageHeader
                title={t["app.examples.title"]}
            />
            <Typography variant="h6">Tabs:</Typography>
            <Tabs>
                <Box
                    index={1}
                    label="Aba 1"
                    component={<p>Conteudo da Aba 1</p>}
                />
                <Box
                    index={2}
                    label="Aba 2"
                    component={<p>Conteudo da Aba 2</p>}
                />
                <Box
                    index={3}
                    label="Aba 3"
                    component={<p>Conteudo da Aba 3</p>}
                />
            </Tabs>
            <Divider />

            <Typography variant="h6">TextField:</Typography>
            <TextField
                label="TextField"
                value={textFieldValue}
                onChange={evt => setTextFieldValue(evt.target.value)}
            />
            <br />
            <br />
            <Divider />

            <Typography variant="h6">Select:</Typography>
            <Select
                label="Valor Numerico"
                value={selectValue}
                setState={setSelectValue}
                list={selectList}
            />
            <br />
            <br />
            <Divider />
            <Typography variant="h6">Autocomplete:</Typography>
            <br />
            <div>{`Value Id: ${autocompleteValue !== null ? `${autocompleteValue.id}` : 'null'}`}</div>
            <div>{`Value Label: ${autocompleteValue !== null ? `${autocompleteValue.label}` : 'null'}`}</div>
            <br />
            <ItemAutocomplete
                name="Itens"
                value={autocompleteValue}
                setValue={setAutocompleteValue}
            />
            <br />
            <Divider />
            <br />

            <Typography variant="h6">Autocomplete in Array:</Typography>
            <br />
            {
                autocompleteInList.DocumentLines.map((item, index) => {
                    return (
                        <>
                            <ItemAutocomplete
                                name="Item"
                                value={autocompleteInList.DocumentLines[index].Item}
                                setValue={(newValue) => {
                                    setChildField('DocumentLines', 'Item', index, newValue)
                                }}                                
                            />
                            <Button
                                onClick={() => { handleDeleteLine(index) }}
                            >
                                Excluir
                            </Button>
                            <br />
                            <br />
                        </>
                    )
                })
            }
            <Button
                onClick={() => { console.log(autocompleteInList) }}
            >
                Check Autocomplete List
            </Button>
            <Button
                variant='outlined'
                onClick={handleNewLine}
            >
                Add Line to Autocomplete List
            </Button>

        </>
    )
}