import { useState } from "react";

export const useSaveSelected = () => {
  const [saveSelected, setSaveSelected] = useState([]);
  return [saveSelected, setSaveSelected];
};