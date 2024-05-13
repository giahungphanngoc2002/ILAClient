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
    size={size} 
     {...rest}
     >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  );
}

