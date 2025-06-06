'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_OPTIONS } from "@/utils/constants";
import { useActionState, useEffect } from "react";
import { changeRole } from "../actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BadgeInfo } from "lucide-react";

const initialState = {
    success: false,
  message: '',
  errors: {} as Record<string, string[]>
}

export default  function GrantRole({id, grantedById, initialRole}: {id: string, grantedById: string, initialRole: string}) {
 const [state, formAction, isPending] = useActionState(changeRole, initialState)
 useEffect(() => {
    if (state.success === true && state.message) {
        toast.success(state.message)
    }
 }, [state.success, state.message])
 useEffect(() => {
    if (state.errors.message && state.success === false) {
        toast.error(state.errors.message[0])
    }
 }, [state.errors, state.success])
    return (
      <>
     
        <form action={formAction} className="space-y-2">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="grantedById" value={grantedById} />
            <Label htmlFor="role" className="flex items-center gap-1">
                  User Role
                  <TooltipProvider>
                    <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipProvider>
                </Label>
                <div className="flex flex-row gap-4 items-center">
          <Select name="role" defaultValue={initialRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">{isPending ? 'Granting...' : 'Grant Role'}</Button>
          </div>
         
        </form>
     
      </>
    );
  }