import PermissionsProvider from "@/utils/providers/permissions";
import { Suspense } from "react";
import DeleteButton from "./delete-button";
import { SharedAccount } from "@prisma/client";

export default function AdminSection({sharedAccount}: {sharedAccount: SharedAccount}) {
    return (
        <div>
            <PermissionsProvider requiredPermission="delete" replaceWith={<p></p>}>
            <h1>Admin Section</h1>
            <Suspense fallback={<div>Loading Delete Button...</div>}>
                 <DeleteButton id={sharedAccount.id} />
               </Suspense>
            </PermissionsProvider>
        </div>
    )
}