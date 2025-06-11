import { notFound, redirect } from 'next/navigation'
import {prisma} from '@/lib/prisma'
import Software from './tabs/software'

import { createClient } from '@/utils/supabase/server'

import SharedAccounts from './tabs/shared-accounts'

import { Badge } from '@/components/ui/badge'


import { Avatar, AvatarFallback,  } from '@/components/ui/avatar'
import { Sparkles, Users, Monitor, Mail, Key , Briefcase , ChevronRight} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserCircle} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Overview from './tabs/overview'
import Details from './tabs/details'
import PermissionsProvider from '@/utils/providers/permissions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense } from 'react'
import { StatusBadge } from '@/components/ui/status-badge'
import { StatusTypes } from '@/types/types'
import History from './components/history'








export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user) {
    redirect('/login')
  }
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        reportsTo: true,
        Location: true,
        headedDepartments: true,
        Department: true,
       
      },
    })
    if (!user) {
      return notFound()
    }
 

   
    const departments = await prisma.department.findMany({
      orderBy: {
        name: 'asc',
      },
    })
   
      
      
      const users = await prisma.user.findMany({
        orderBy: {
            name: 'asc',
        },
        where: {id: {not: id}}
      });
     
      const locations = await prisma.location.findMany({
        orderBy: {
            name: 'asc',
        },
      });

      //have software.grantedBy
      //if we have that we want to search our list of auth users for a match and show their details not current user
    
     // mn-h-screen
    return( <>
<div className=" vercel-gradient-subtlei">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className={`flex items-center justify-between  animate-fade-in-up`}>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-16 w-16 border-2 border-white shadow-vercel-lg ring-1 ring-neutral-200 transition-all duration-500 group-hover:ring-blue-300 group-hover:shadow-vercel-xl hover-lift animate-pulse-glow"> 
                
                <AvatarFallback className="text-lg bg-gradient-to-r from-orange-300 to-orange-500 text-white font-medium">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 gradient-emerald-subtle rounded-full p-1 shadow-vercel animate-bounce-subtle">
                <Sparkles className="h-3 w-3 text-black animate-rotate-gentle" />
              </div>
            </div>
            <div className="animate-slide-in-right">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-gradient-primary">{user.name}</h1>
                <StatusBadge status={user.status as StatusTypes} />
                <Badge className="bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 transition-all duration-300 text-xs font-medium hover-scale">
                  {user.id}
                </Badge>
              </div>
              <p className="text-neutral-600 font-medium">{user.jobTitle}</p>
              <p className="text-sm text-neutral-500">{user.Department?.name}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 animate-fade-in-scale stagger-2`}>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 text-sm font-medium hover-lift micro-bounce"
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Add Owner
            </Button>
            {/* <Button
              variant="outline"
              size="sm"
              className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300 text-sm font-medium hover-lift micro-bounce"
            >
              <Clock className="h-4 w-4 mr-2" />
              History
            </Button> */}
            <Suspense fallback={<div>Loading...</div>}>
              <History id={id} />
            </Suspense>
         </div>
         </div>
         </div>
        
         <Card
          className={`border border-neutral-200 shadow-vercel-lg bg-white rounded-lg overflow-hidden  transition-all duration-500 animate-fade-in-scale stagger-3`}
        >
          <div className="p-8">
            {/* Profile Overview Section */}
<Suspense fallback={<div>Loading...</div>}>
            <PermissionsProvider requiredPermission="edit" replaceWith={ <Overview user={user} />}>
              <Details user={user} locations={locations} departments={departments} authId={data.user.id} users={users} />
            </PermissionsProvider>
            </Suspense>
            <Tabs defaultValue="reporting" className="space-y-6">
               <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-neutral-100 p-0 border border-neutral-200 rounded-full mx-auto">
          <TabsTrigger
            value="reporting"
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:scale-105"
          >
            <Users className="h-4 w-4 mr-2" />
            Reporting
          </TabsTrigger>
          <TabsTrigger
            value="software"
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:scale-105"
          >
            <Monitor className="h-4 w-4 mr-2" />
            Software
          </TabsTrigger>
          <TabsTrigger
            value="sharedAccounts"
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:scale-105"
          >
            <Mail className="h-4 w-4 mr-2" />
            Shared Accounts
          </TabsTrigger>
          <TabsTrigger
            value="access"
            className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:scale-105" 
            disabled={true}
          >
            <Key className="h-4 w-4 mr-2" />
            Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reporting" className="space-y-6 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div className="animate-fade-in-up stagger-1">
                    <h3 className="text-xl font-semibold text-neutral-900 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 border border-blue-200 hover-scale transition-transform duration-300">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      Reporting Structure
                    </h3>
                    <p className="text-neutral-500 text-sm mt-1">Manager and team information</p>
                  </div>
                 
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-neutral-900 flex items-center gap-2 animate-fade-in-up stagger-2">
                    <div className="p-1.5 rounded-lg bg-violet-100 border border-violet-200 hover-scale transition-transform duration-300">
                      <Briefcase className="h-3.5 w-3.5 text-violet-600" />
                    </div>
                    Reports To
                  </h4>
                  
                    <div className="group cursor-pointer animate-fade-in-up stagger-3">
                      {user.reportsTo && (
                      <Card className="p-4 border border-neutral-200 shadow-vercel bg-white rounded-lg hover:shadow-vercel-lg transition-all duration-500 hover:border-neutral-300 hover-lift">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-vercel ring-1 ring-neutral-200 hover-scale transition-all duration-300">
                            <AvatarFallback className=" font-medium bg-gradient-to-r from-orange-300 to-orange-500 text-white">
                              {user.reportsTo?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-neutral-900">{user.reportsTo?.name}</p>
                            <p className="text-neutral-600 text-sm">{user.reportsTo?.jobTitle}</p>
                            <p className="text-blue-600 text-sm font-medium ">{user.reportsTo?.email}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-600 transition-all duration-300 group-hover:translate-x-1" />
                        </div>
                      </Card>
                      )}
                      {!user.reportsTo && (
                         <Card className="border-dashed">
                         <CardContent className="flex flex-col items-center justify-center py-12 px-6">
                           <div className="rounded-full bg-neutral-100 p-4 mb-4">
                             <Users className="h-8 w-8 text-neutral-500" />
                           </div>
                           <h3 className="font-semibold text-lg mb-2">No Reports Yet</h3>
                           <p className="text-muted-foreground text-center max-w-sm">
                             This user doesn&apos;t have any direct reports assigned to them at the moment.
                           </p>
                         </CardContent>
                       </Card>
                      )}
                    </div>
                 
                </div>
              </TabsContent>
        <TabsContent value="software" className="space-y-6 animate-fade-in-up">
          <Software id={id} authId={data.user.id} />
        </TabsContent>
        <TabsContent value="sharedAccounts" className="space-y-6 animate-fade-in-up">
          <SharedAccounts id={id} authId={data.user.id} />
        </TabsContent>
                    </Tabs>

            </div>
            </Card>

       </div>


        

       

      
    </>
  )
}



  //tablou fe769674-65d0-4528-92af-2f2df451164e
  //derek 50313f26-7397-4d88-9e37-937c212d8eb2



/**
 *   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            <h1 className='text-2xl font-bold'>{user.name}</h1>
            
            <p className="text-green-700">Department: {user.Department?.name}</p>
            <p className="text-green-700">Job Title: {user.jobTitle}</p>
            <p className="text-green-700">Email: {user.email}</p>
            <p className="text-green-700">Location: {user.Location?.name}</p>
            <p className="text-green-700">Reports To: {user.reportsTo?.name}</p>
            <p className="text-green-700">Type: {user.type}</p>

           <Badge>{user.status}</Badge>
        

<EditUser user={user as User & {reportsTo: User}}  authId={data.user.id} users={users} locations={locations} departments={departments} />

        ===============================
        <h1>Software</h1>

        <div>
      {software.map(async (software) => {
        const removeAssignedSoftwareWithIds = removeAssignedSoftware.bind(null, id, software.software.id, data.user.id);
        const grantedBy= await findRealUser(software.grantedById);
        
        return (
          <div key={software.id}>
            <Link href={`/dashboard/software/${software.software.id}`} prefetch={true}>
              <h2>{`---> ${software.software.name}`}</h2>
            </Link>
            <p className="text-green-700">{software.software.description}</p>
            <p className="text-green-700">Granted By: {grantedBy.email}</p>
            <p className="text-green-700">Access Level: {software.accessLevel}</p>
            <p className="text-green-700">Role: {software.role}</p>
           
            <form action={removeAssignedSoftwareWithIds} className="flex flex-col gap-4">
              <button type="submit">Remove</button>
            </form>
          </div>
        );
      })}
    </div>

        ============================
       
       

        <h2>Assign Software</h2>
        <form action={assignSoftware} className='flex flex-col gap-4'>
            <select name="softwareId">
                {availableSoftware.map((software) => (
                    <option key={software.id} value={software.id}>{software.name}</option>
                ))}
            </select>
            <input type="text" name="grantedById"  defaultValue={data.user.id} hidden />
            {/* <select name="grantedById" className='flex flex-col gap-4'>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select> 
            *}
            
            <input type="text" name="accessLevel" placeholder="Access Level*" />
            <input type="text" name="role" placeholder="Role*" />
            <input type="text" name="userId" defaultValue={id} hidden />
            <button type="submit">Assign Software +</button>
        </form>
        ============================

       

        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        <EmployeeProfile />



 */