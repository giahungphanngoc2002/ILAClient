import { Button } from "antd";
import React from "react";

export default function ButtonComponent({
  size,
  styleButton,
  styleTextButton,
  textButton,
  disabled,
  ...rest
}) {
  return (
    
    <Button 
    style={{
      ...styleButton,
      background : disabled ? '#ccc' : styleButton.background
    }}
    disabled={disabled}
    size={size} 
     {...rest}
     >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  );
}

