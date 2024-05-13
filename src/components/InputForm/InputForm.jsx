import { Input } from 'antd';
import React, { useState } from 'react'
import { WrapperInputStyle } from './style';

export default function InputForm(props) {
    // const [valueInput, setValueInput] = useState('')
    const {placeholder = "Nhập text", ...rest} = props
    const handleOnchangeInput =(e) =>{
      props.Onchange(e.target.value)
    }
  return (
    <>
        <WrapperInputStyle placeholder={placeholder}  value={props.value} {...rest}
        onChange={handleOnchangeInput}
        />
    </>
  )
}
