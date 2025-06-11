'use client'
import { DataTable } from './shared-accounts-table/data-table'
import { columns, SharedAccountSoftwareWithRelations } from './shared-accounts-table/columns'

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
