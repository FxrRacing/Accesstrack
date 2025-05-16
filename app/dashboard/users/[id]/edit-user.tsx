'use client'
import { editUser } from "@/actions/user_actions";
import { EMPLOYMENT_STATUS_OPTIONS } from "@/utils/constants";
import { Department, User } from "@prisma/client";
import { useActionState, useEffect } from "react";
import { Location } from "@prisma/client";
import { toast } from "sonner";


export default function EditUser({user, authId, users, locations, departments}: {user: User&{reportsTo: User}, authId: string, users: User[], locations: Location[], departments: Department[]}) {
    //providing total users temporarily
    const initialState = {
        message: '',
      }
      
    const [error, formAction, pending] = useActionState(editUser, initialState)
    useEffect(() => {

      if(!pending) {
        if(error && error.message){
          toast.error(error.message)
        } 
        else if(user.id) {
          toast.success('User updated successfully')
          
        }
      }else{
        toast.success('Updating user...')
      }
      
    }, [error, pending, user.id])
    return <div>
        <h1>Edit User</h1>
        <form action={formAction} className="flex flex-col gap-2 w-1/2 border-2 border-gray-300 p-4">

            <input type="text" name="id" value={user.id} readOnly hidden  />
            <label htmlFor="name">Name</label>
            <input type="text" name="name" defaultValue={user.name} className="border-2 border-gray-300 p-2" />
            <label htmlFor="department">Department</label>
            <select name="departmentId" className="border-2 border-gray-300 p-2">
                {departments.map((department: Department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
            </select>
            <label htmlFor="jobTitle">Job Title</label>
            <input type="text" name="jobTitle" defaultValue={user.jobTitle || ''} className="border-2 border-gray-300 p-2" />
            <label htmlFor="email">Email</label>
            <input type="text" name="email" defaultValue={user.email || ''} className="border-2 border-gray-300 p-2"  />
            <label htmlFor="location">Location</label>
           <select name="locationId" className="border-2 border-gray-300 p-2">
            {locations.map((location: Location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
           </select>
            <label htmlFor="status">Status</label>
            <select name="status" className="border-2 border-gray-300 p-2">
                {EMPLOYMENT_STATUS_OPTIONS.map((option: { value: string; label: string }) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
            </select>
            <input type="text" name="authId" value={authId} readOnly hidden />
            <label htmlFor="reportsToId">Reports To</label>
            <select name="reportsToId" className="border-2 border-gray-300 p-2">
             {user.reportsToId && <option value={user.reportsTo.id}>{user.reportsTo.name}</option>}
                {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            <label htmlFor="onboardingDate">Onboarding Date</label>
            <input type="date" name="onboardingDate" defaultValue={user.onboardingDate ? user.onboardingDate.toISOString().split('T')[0] : ''} className="border-2 border-gray-300 p-2" />
            <label htmlFor="offboardingDate">Offboarding Date</label>
            <input type="date" name="offboardingDate" defaultValue={user.offboardingDate ? user.offboardingDate.toISOString().split('T')[0] : ''} className="border-2 border-gray-300 p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">{pending ? 'Updating...' : 'Update'}</button>
            {error && <p>{error.message}</p>}
        </form>

       
    </div>
}