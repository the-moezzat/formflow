'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';
import { createColumns } from './columns';
import type { FormField } from '@repo/schema-types/types';
import { decodeJsonData } from '@/utils/formEncoder';
import { useMemo } from 'react';

interface DataTableProps<TData, TValue> {
  data: FormField[];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  responses: Record<string, any>[];
}

export function DataTable<TData, TValue>({
  data,
  responses,
}: DataTableProps<TData, TValue>) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const columns = useMemo(() => createColumns(data), []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const decodedResponses = useMemo(
    () =>
      responses.map((response) => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        return decodeJsonData(response.encodedResponse) as Record<string, any>;
      }),
    []
  );

  const table = useReactTable({
    data: decodedResponses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-content rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, idx) => {
              //   console.log('row', row);
              console.log('cell', decodedResponses[idx]);

              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell, idx) => {
                    // console.log('cell', decodedResponses[idx]);
                    return (
                      <TableCell key={cell.id}>
                        {/* {decodedResponses[idx][cell.row.original.name]} */}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
