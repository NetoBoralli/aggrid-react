import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/home";
import { AgGridReact } from "ag-grid-react";

interface SpaceMission {
  mission: string;
  company: string;
  location: string;
  date: string;
  time: string;
  rocket: string;
  price: number;
  successful: boolean;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AgGrid test" },
    { name: "description", content: "AgGrid test" },
  ];
}

const CompanyLogoRenderer = ({ value }: { value: string }) => (
  <span
    style={{
      display: "flex",
      height: "100%",
      width: "100%",
      alignItems: "center",
    }}
  >
    {value && (
      <img
        alt={`${value} Flag`}
        src={`https://www.ag-grid.com/example-assets/space-company-logos/${value.toLowerCase()}.png`}
        style={{
          display: "block",
          width: "25px",
          height: "auto",
          maxHeight: "50%",
          marginRight: "12px",
          filter: "brightness(1.1)",
        }}
      />
    )}
    <p
      style={{
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </p>
  </span>
);

export default function AgGrid() {
  const GridExample = () => {
    const [rowData, setRowData] = useState<SpaceMission[]>([]);

    const [colDefs, setColDefs] = useState([
      { field: "mission" as const },
      { field: "company" as const, cellRenderer: CompanyLogoRenderer },
      { field: "location" as const },
      { field: "date" as const },
      {
        field: "price" as const,
        valueFormatter: (params: any) => `£${params.value.toLocaleString()}`,
      },
      { field: "successful" as const },
      { field: "rocket" as const },
    ]);

    useEffect(() => {
      fetch("https://www.ag-grid.com/example-assets/space-mission-data.json")
        .then((result) => result.json())
        .then((rowData) => setRowData(rowData));
    }, []);

    const defaultColDef = useMemo(
      () => ({
        filter: true,
        flex: 1,
      }),
      []
    );

    const rowSelection = useMemo(
      () => ({
        mode: "multiRow" as const,
      }),
      []
    );

    return (
      <div style={{ height: "100vh" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          onCellValueChanged={(event) => {
            console.log(`New Cell Value: ${event.value};`);
          }}
          rowSelection={rowSelection}
          onRowSelected={(event) => {
            console.log(event.api.getSelectedRows());
          }}
        />
      </div>
    );
  };

  return <GridExample />;
}
