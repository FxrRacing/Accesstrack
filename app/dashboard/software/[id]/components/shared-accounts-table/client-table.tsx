'use client'
import { DataTable } from './data-table'
import { columns, SharedAccountSoftwareWithRelations } from './columns'

export default function SharedAccountsTableClient({
  data,
  authId,
}: {
  data: SharedAccountSoftwareWithRelations[]
  authId: string
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      authId={authId}
    />
  )
} 