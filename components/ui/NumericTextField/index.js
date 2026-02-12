import React, { useState, useEffect } from 'react'
import AutoNumeric from 'autonumeric'
import { TextField } from '@mui/material'

export default function NumericTextField(props) {
  
  const [autonumericInstance, setAutonumericInstance] = useState({})
  const [inputReference, setInputReference] = useState('')

  useEffect(() => {
    

    if(inputReference && props.value) {
      console.log(props.value)

      const an = new AutoNumeric(inputReference, props.value, {
        digitGroupSeparator: '.',
        decimalCharacter: ',',
        decimalPlaces: props.decimalPlaces ? props.decimalPlaces : 4,
        watchExternalChanges: true
      })

      setAutonumericInstance(an)
    }

  }, [inputReference, props.value])

  const otherProps = {}
  ;[
    "id",
    "label",
    "className",
    "autoFocus",
    "variant",
    "style",
    "error",
    "disabled",
    "type",
    "name",
    "defaultValue",
    "tabIndex",
    "fullWidth",
    "rows",
    "select",
    "required",
    "helperText",
    "unselectable",
    "margin",
    "SelectProps",
    "multiline",
    "size",
    "FormHelperTextProps",
    "placeholder",
  ].forEach(prop => (otherProps[prop] = props[prop]))

  return (
    <input        
      inputRef={ref => {
        setInputReference(ref)
      }}
      onChange={(event) => {
        console.log('TxtField: ',event.target.value)
        props.onChange(autonumericInstance.rawValue)
      }}
      inputProps={{
        style: {
          textAlign: "right"
        }
      }}      
      {...otherProps}
    />
  )
}