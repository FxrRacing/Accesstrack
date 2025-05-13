'use client'

import { createSoftware } from "@/actions/software_actions";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
const initialState = {
    message: '',
  }

export function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button disabled={pending} type="submit">
      {pending ? 'Creating...' : 'Create Software'}
    </Button>
  )
}

export default function CreateForm() {
    const [error, formAction, pending] = useActionState(createSoftware, initialState )
    const [website, setWebsite] = useState('');
    const [icon, setIcon] = useState<string | null>(null);
    const [iconUrl, setIconUrl] = useState<string | null>(null);
    const [isLoadingIcon, setIsLoadingIcon] = useState(false);

    // Handle website input change
    const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWebsite(e.target.value);
    };

    // Fetch icon when website input changes (with debounce)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (website) {
                setIsLoadingIcon(true);
                try {
                    const iconUrl = await retrieveIcon(website, setIconUrl);
                    setIcon(iconUrl);
                } catch (error) {
                    console.error("Failed to retrieve icon:", error);
                    setIcon(null);
                } finally {
                    setIsLoadingIcon(false);
                }
            } else {
                setIcon(null);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [website]);

    return (<>

<Dialog>
  <DialogTrigger asChild>
    <Button>Create Software</Button>
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Software</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      Create a new software item
    </DialogDescription>

    <form action={formAction} className="flex flex-col gap-4">
      <Label>Name</Label>
            <Input type="text" name="name" placeholder="Name" />
            <Label>Description</Label>
            <Input type="text" name="description" placeholder="Description" />
            <Label>Category</Label>
            <Input type="text" name="category" placeholder="Category" />
            <Label>Status</Label>
            <Input type="text" name="status" placeholder="Status" />
            <Label>Website</Label>
            <div className="flex items-center gap-2">
                <Input 
                    type="text" 
                    name="website" 
                    placeholder="Website" 
                    value={website}
                    onChange={handleWebsiteChange}
                />
                {isLoadingIcon && <div className="w-6 h-6 animate-spin">⟳</div>}
                {icon && !isLoadingIcon && (
                  <Image
                  src={icon}
                  width={30}
                  height={30}
                  className="rounded-md"
                  alt="Picture of the author"
                />
                   
                )}
              <Input type="hidden" name="icon" value={iconUrl || ''} />
            </div>
            
            


           <Button type="submit">{pending ? 'Creating...' : 'Create Software'}</Button>
        </form>
        {error && <p>{error.message}</p>}
  </DialogContent>
</Dialog>
    
       
        </>
    )
}

export function cleanDomain(input: string) {
  try {
    const url = new URL(input.includes('://') ? input : `https://${input}`);
    return url.hostname.replace(/^www\./, '');
  } catch (error) {
    console.error("Error cleaning domain:", error);
    return null;
  }
}

export async function retrieveIcon(website: string, setIconUrl: (iconUrl: string) => void) {
  // Clean the domain first
  const cleanedDomain = cleanDomain(website);
  
  if (!cleanedDomain) return null;
  
  try {
    console.log(`${process.env.NEXT_PUBLIC_ICON_API_BASE_URL}/${cleanedDomain}?token=${process.env.NEXT_PUBLIC_ICON_API_KEY}`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_ICON_API_BASE_URL}/${cleanedDomain}?token=${process.env.NEXT_PUBLIC_ICON_API_KEY}`);
    
    // Check if response is OK
    if (!response.ok) return null;
    setIconUrl(response.url);
    
    // Convert response to blob and create a URL
    const blob = await response.blob();
    const iconUrl = URL.createObjectURL(blob);
   
    return iconUrl;
  } catch (error) {
    console.error("Error fetching icon:", error);
    return null;
  }
}

