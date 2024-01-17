import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";

export type ProtocolTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];
};

export function ProtocolTable<Data extends object>({
  data,
  columns
}: ProtocolTableProps<Data>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table style={{ backgroundColor: "black", color:"white", borderColor:"red" }}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header, columnIndex) => {
              const meta: any = header.column.columnDef.meta;
              return (
                <Th style={{ color:"white", borderColor:"#22262c", backgroundColor: columnIndex === 1 ? "#005aff" : "inherit" }}
                  key={header.id}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell, cellIndex) => {
              const meta: any = cell.column.columnDef.meta;
              return (
                <Td key={cell.id} isNumeric={meta?.isNumeric} 
                  style={{ 
                    borderColor:"#22262c", 
                    backgroundColor: cellIndex === 1 ? "#005aff" : "inherit", 
                    fontSize: cellIndex === 0 ? "18px" : "inherit", 
                    fontWeight: cellIndex === 0 ? "800" : "inherit",
                    width: cellIndex === 0 ? "20%" : "inherit",
                  }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
