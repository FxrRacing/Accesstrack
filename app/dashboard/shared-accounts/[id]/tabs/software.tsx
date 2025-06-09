import {  CardTitle } from "@/components/ui/card";

import { CardHeader } from "@/components/ui/card";

import { CardContent } from "@/components/ui/card";
import { SharedAccount } from "@prisma/client";
import { User } from "@supabase/supabase-js";

import { prisma } from "@/lib/prisma";

import { SoftwareTable } from "../components/software-table";
import { Settings } from "lucide-react";
import AddSoftwareDialog from "../components/add-software-dialog";

export default async function SoftwareTab({sharedAccount, data}: {sharedAccount: SharedAccount, data: {user: User}}) {
    const alreadyAssignedSoftware = await prisma.sharedAccountSoftware.findMany({
        where: {
            sharedAccountId: sharedAccount.id,
        },
        include: {
            software: true,
        },
    })
    const alreadyAssignedSoftwareIds = alreadyAssignedSoftware.map(
        (s) => s.softwareId
      );
    
      const availableSoftware = await prisma.software.findMany({
        where: {
          id: {
            notIn: alreadyAssignedSoftwareIds,
          },
        },
      });
    return (
        <>

<CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Software Access</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Manage software assignments and permissions • {alreadyAssignedSoftware.length} total
              </p>
            </div>
          </div>
         
          <AddSoftwareDialog sharedAccount={sharedAccount} availableSoftware={availableSoftware} data={data} /> 
        </div>
      </CardHeader>
              <CardContent className="pt-0">
                
              <SoftwareTable
                alreadyAssignedSoftware={alreadyAssignedSoftware}
                availableSoftware={availableSoftware}
                sharedAccount={sharedAccount}
                data={data}
              />

                
              </CardContent>
              
        </>
    )
}