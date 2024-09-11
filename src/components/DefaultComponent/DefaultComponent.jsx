import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";

export default function  DefaultComponent({ children }) {
  return (
    <div>
      <HeaderComponent />
      {children}
    </div>
  );
}
