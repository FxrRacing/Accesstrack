"use client"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionState, useEffect } from "react";
import {toast} from "sonner"
import { addLocation } from "./actions";


// address: string;
//     name: string;
//     type: string;
//     id: string;
//     city: string;
//     state: string;
//     postalCode: string;
//     country: string;
//     latitude: number | null;
//     longitude: number | null;
const initialState = {
   message: '',
}

export default function AddLocation() {
const [state, formAction, pending] = useActionState(addLocation, initialState)    
useEffect(() => {
    if (state.message && !pending) {
      if (state.message.includes('Error')) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
      }
    }
  }, [state.message, pending]);
    return <Dialog>
        <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/80 rounded-full px-6">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Location
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>  
                <DialogTitle>Add Location</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Add a new location to your organization.
            </DialogDescription>
            <form className="space-y-4" action={formAction}>
            <div className="space-y-2">
                <Label>Name*</Label>
                <Input placeholder="Location Name" name="name" />
            </div>
            <div className="space-y-2">
                <Label>Address*</Label>
                <Input placeholder="Location Address" name="address" />
            </div>
            <div className="space-y-2">
                <Label>Type*</Label>
                <Select name="type">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="store">Store</SelectItem>
                        <SelectItem value="headquarters">Headquarters</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>City*</Label>
                <Input placeholder="Location City" name="city" />
            </div>
            <div className="space-y-2">
                <Label>State*</Label>
                <Input placeholder="Location State" name="state" />
            </div>
            <div className="space-y-2">
                <Label>Postal Code*</Label>
                <Input placeholder="Postal Code" name="postalCode" />
            </div>
            <div className="space-y-2">
                <Label>Country*</Label>
                <Select name="country">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="SE">Sweden</SelectItem>
                        <SelectItem value="NO">Norway</SelectItem>
                        <SelectItem value="DK">Denmark</SelectItem>
                        <SelectItem value="FI">Finland</SelectItem>
                        <SelectItem value="HK">Hong Kong</SelectItem>
                      
                        <SelectItem value="DE">Germany</SelectItem>
                        
                       
                      
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-4 justify-between items-center">
            <div className="space-y-2"  >
                <Label>Latitude</Label>
                <Input name="latitude" />
            </div>
            <div className="space-y-2"  >
                <Label>Longitude</Label>
                <Input name="longitude" />
            </div>
            </div>
            
            
            <Button className="bg-black text-white hover:bg-black/80  px-6" disabled={pending}>Add Location <PlusCircle className="ml-2 h-4 w-4" /></Button>

            </form>
        </DialogContent>
    </Dialog>
}