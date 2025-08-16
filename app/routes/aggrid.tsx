import { useState } from "react";
import type { Route } from "./+types/home";
import { AgGridReact } from "ag-grid-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AgGrid test" },
    { name: "description", content: "AgGrid test" },
  ];
}

export default function AgGrid() {
  const GridExample = () => {
    const [rowData, setRowData] = useState([
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
      { make: "Mercedes", model: "EQA", price: 48890, electric: true },
      { make: "Fiat", model: "500", price: 15774, electric: false },
      { make: "Nissan", model: "Juke", price: 20675, electric: false },
    ]);
  
    const [colDefs, setColDefs] = useState([
      { field: "make" as const },
      { field: "model" as const },
      { field: "price" as const },
      { field: "electric" as const },
    ]);
  
    const defaultColDef = {
      flex: 1,
    };
  
    return (
      <div style={{ height: "100vh" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    );
  };

  return <GridExample />;
}
