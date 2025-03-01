'use client';

import type { FormField } from '@repo/schema-types/types';
import type { ColumnDef } from '@tanstack/react-table';

// // This type is used to define the shape of our data.
// // You can use a Zod schema here if you want.
// export type Payment = {
//   id: string;
//   amount: number;
//   status: 'pending' | 'processing' | 'success' | 'failed';
//   email: string;
// };

// export const columns: ColumnDef<Payment>[] = [
//   {
//     accessorKey: 'status',
//     header: 'Status',
//   },
//   {
//     accessorKey: 'email',
//     header: 'Email',
//   },
//   {
//     accessorKey: 'amount',
//     header: 'Amount',
//   },
// ];

export function createColumns<T extends Record<string, unknown>>(
  data: FormField[]
): ColumnDef<T>[] {
  const columns = data.map((field) => {
    return {
      accessorKey: field.id,
      header: field.label,
      accessorFn: (row) => row[field.name],
    };
  }) as ColumnDef<T>[];

  return columns;
}
