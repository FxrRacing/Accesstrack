"use client"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionState, useEffect, useState } from "react";
import {toast} from "sonner"
import { addLocation } from "./actions";
import { LocationSuggestions } from "./locationSuggestions";


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

type LocationData = {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

export default function AddLocation() {
const [state, formAction, pending] = useActionState(addLocation, initialState)    
const [locationData, setLocationData] = useState<LocationData | null>(null);

// Handle location selection
const handleLocationSelect = (data: LocationData) => {
  setLocationData(data);
  
  // Optionally, you could also update a hidden form field with the data
  console.log("Selected location:", data);
};

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
            <LocationSuggestions 
              onSelect={handleLocationSelect} 
              label="Find Location"
            />
            <div className="space-y-2">
                <Label>Address*</Label>
                <Input 
                  placeholder="Location Address" 
                  name="address"
                  disabled={true}
                  readOnly={true}
                  value={locationData?.address || ""}
                  onChange={(e) => setLocationData(prev => prev ? {...prev, address: e.target.value} : null)}
                />
            </div>
            <div className="space-y-2">
                <Label>City*</Label>
                <Input 
                  placeholder="Location City" 
                  name="city" 
                  value={locationData?.city || ""}
                  onChange={(e) => setLocationData(prev => prev ? {...prev, city: e.target.value} : null)}
                />
            </div>
            <div className="space-y-2">
                <Label>State*</Label>
                <Input placeholder="Location State" name="state" value={locationData?.state || ""} onChange={(e) => setLocationData(prev => prev ? {...prev, state: e.target.value} : null)}/>
            </div>
            <div className="space-y-2">
                <Label>Postal Code*</Label>
                <Input placeholder="Postal Code" name="postalCode" value={locationData?.postalCode || ""} onChange={(e) => setLocationData(prev => prev ? {...prev, postalCode: e.target.value} : null)}/>
            </div>
            <div className="space-y-2">
                <Label>Country*</Label>
                <Select name="country" value={locationData?.country || ""} onValueChange={(value) => setLocationData(prev => prev ? {...prev, country: value} : null)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Country" defaultValue={locationData?.country || ""} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
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
                <Input 
                  name="latitude" 
                  value={locationData?.latitude?.toString() || ""}
                  onChange={(e) => setLocationData(prev => prev ? {...prev, latitude: parseFloat(e.target.value) || null} : null)}
                />
            </div>
            <div className="space-y-2"  >
                <Label>Longitude</Label>
                <Input 
                  name="longitude" 
                  value={locationData?.longitude?.toString() || ""}
                  onChange={(e) => setLocationData(prev => prev ? {...prev, longitude: parseFloat(e.target.value) || null} : null)}
                />
            </div>
            </div>
            
            
            <Button className="bg-black text-white hover:bg-black/80  px-6" disabled={pending}>Add Location <PlusCircle className="ml-2 h-4 w-4" /></Button>

            </form>
        </DialogContent>
    </Dialog>
}