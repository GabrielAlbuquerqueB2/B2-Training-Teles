import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import styles from './ItemCellEditor.module.css'
import { getItemListByDescription } from './ItemCellEditorService'

export default forwardRef((props, ref) => {
    const inputRef = useRef()
    const [value, setValue] = useState('')
    const [options, setOptions] = useState([])

    function inputHandler(e) {
        setValue(e.target.value)
    }

    useEffect(() => {        
        inputRef.current.focus()
    }, [inputRef])

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value;
            },
            afterGuiAttached: () => {
                setValue(props.value)
                inputRef.current.focus()
                inputRef.current.select()
            }
        };
    });

    async function fetchItemData(description) {
        const result = await getItemListByDescription(description)
        return result
    }

    async function handleKeyDown(evt) {        
        const inputValue = evt.target.value
        const upperCaseInputValue = inputValue.toUpperCase()
        const DOWN_ARROW_CODE = 40

        if (evt.keyCode === DOWN_ARROW_CODE) {
            const itemsOptions = await fetchItemData(upperCaseInputValue)
            const filtered = itemsOptions.filter(item => {
                return (item.ItemCode.toUpperCase().includes(upperCaseInputValue) 
                || item.ItemName.toUpperCase().includes(upperCaseInputValue))
            })
            setOptions(filtered)
        }
    }

    return (
        <div>
            <input
                type="text"
                className={styles.inputText}
                ref={inputRef}
                onChange={inputHandler}
                value={value}
                placeholder={'Selecione o item'}
                onKeyDown={handleKeyDown}
            />
            <div>
                <ul
                    className={styles.ulOption}
                    hidden={options.length < 1}
                >
                    {options.map(item => {
                        return <li
                            key={item.ItemCode}
                            className={styles.liOption}
                            onClick={() => {
                                props.setSelectedValue({
                                    ItemCode: item.ItemCode,
                                    ItemName: item.ItemName
                                })
                                props.node.setData({
                                    ...props.node.data,
                                    ItemCode: item.ItemCode,
                                    ItemDescription: item.ItemName
                                })
                                setOptions([])
                                props.api.stopEditing()
                            }}>
                            {item.ItemCode + ' - ' + item.ItemName}
                        </li>
                    })}
                </ul>
            </div>
        </div>
    )
})