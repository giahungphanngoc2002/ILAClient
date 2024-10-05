import React from "react";
import Header from "../HeaderComponent/Header";

export default function  DefaultComponent({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
