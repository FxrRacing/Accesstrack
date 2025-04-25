"use client"

import {  useState } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Check, Copy, Send } from "lucide-react"

//"ADMIN", "EDITOR", "VIEWER","IT"


type supportedRoles = 'ADMIN' | 'EDITOR' | 'VIEWER' | 'IT' | 'SUPER'
const baseUrl="https://access-track.vercel.app/signup?code="
export default function InviteForm() {
  const [email, setEmail] = useState("")
 
  const [isCopied, setIsCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
    
    const [proposedRole, setProposedRole] = useState('VIEWER');
  
  const [invite, setInvite] = useState('')

const userRole ='SUPER' as supportedRoles
 
//"ADMIN", "EDITOR", "VIEWER","IT"
  const handleSendInvite = async() => {

    if (userRole !== 'ADMIN') {
      toast.error("You are not an admin or IT", {
        description: "You cannot send invites",
       
      })
      return
    }
    if (!email) {
      toast.error("Email required", {
        description: "Please enter an email address",
       
      })
      return
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Invalid email", {
      
        description: "Please enter a valid email address",
       
      })
      return
    }

    // In a real app, this would send the invite to your API
    setIsSubmitting(true)
   // const invite = await sendInvitationCode(email, proposedRole);
   
    setInvite(invite);
    // Simulate API call
    setTimeout(() => {
      toast.success("Invitation sent!", {
        
        description: `An invitation has been sent to ${email}.`,
      })
      setEmail("")
      setIsSubmitting(false)
    }, 3000)
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(baseUrl+invite)
    setIsCopied(true)

    toast.success("Link copied!", {
      description: "Invite link copied to clipboard",
    })

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div className="container max-w-md py-10">
      
        <CardHeader>
          <CardTitle className="text-2xl">Invite Team Member</CardTitle>
          <CardDescription>Add a member to your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <p>your current role is {userRole}</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                placeholder="colleague@fxrracing.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={proposedRole} onValueChange={setProposedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>

                
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                  
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Select the appropriate permission level for this team member
              </p>
            </div>
          </div>

          <Separator className="my-2" />

          {invite && (
            <>
                    <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                        <h2 className="text-lg font-semibold">
                            Invite sent to {email} with code: {invite}
                        </h2>
                        <p>{JSON.stringify(invite)}</p>
                    </div>
                    <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Or share invite link</Label>
            </div>
            <div className="flex items-center gap-2">
              <Input value={baseUrl+invite} readOnly className="h-9 bg-muted/50" />
              <Button
                variant="outline"
                size="sm"
                onClick={copyInviteLink}
                className="h-9 whitespace-nowrap flex-shrink-0"
              >
                {isCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Only the user you invite will be able to use this link to join your organization
            </p>
          </div>
                    </>
                )}
          
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSendInvite} disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Sending..." : "Send Invitation"}
          </Button>
        </CardFooter>
    
     
    </div>
  )
}

