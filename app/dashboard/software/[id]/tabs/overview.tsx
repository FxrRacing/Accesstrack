"use client";
import { updateSoftware } from "@/actions/software_actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Software } from "@prisma/client";
import { formatDate } from "date-fns";
import {
  CalendarClock,
  Globe,
  Info,
  Loader2,
  Settings,
  Shield,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useActionState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useState } from "react";

import { useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
const initialState = {
  message: "",
  success: false,
};

interface OverviewTabProps {
  software: Software;
}

export default function Overview({ software }: OverviewTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateSoftware,
    initialState
  );

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
        setIsEditing(false);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);
  return (
    <>
      <Card className="border shadow-sm md:col-span-2">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Info className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Overview
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Manage software overview details
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:bg-slate-50"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {isEditing ? (
            <form action={formAction}>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <input type="hidden" name="id" value={software.id} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="flex flex-col gap-1">
                  <Label>Name*</Label>
                  <Input type="text" name="name" defaultValue={software.name} />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Description*</Label>
                  <Input
                    type="text"
                    name="description"
                    defaultValue={software.description || ""}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Category</Label>
                  <Input
                    type="text"
                    name="category"
                    defaultValue={software.category || ""}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>License Type</Label>
                  <Input
                    type="text"
                    name="licenseType"
                    defaultValue={software.licenseType || ""}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Website</Label>
                  <Input
                    type="text"
                    name="website"
                    defaultValue={software.website || ""}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>
                    Account Representative
                    <Tooltip>
                      <TooltipTrigger>
                        {" "}
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          If there are multiple account representatives, enter
                          the primary one here and list additional reps in the
                          notes section.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    type="text"
                    name="accountRep"
                    defaultValue={software.accountRep || ""}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Notes</Label>
                  <Textarea name="notes" defaultValue={software.notes || ""} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={pending}>
                  {pending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-1 text-muted-foreground">Category</p>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1.5" />
                      <p className="font-medium text-slate-700">
                        {software.category}
                      </p>
                    </div>
                  </Badge>
                </div>

                <div>
                  <p className="mb-1 text-muted-foreground">License Type</p>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4  mr-1.5" />
                    <p className="font-medium ">
                      {software.licenseType || "Not specified"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className=" mb-1">Website</p>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-slate-400 mr-1.5" />
                    <a
                      href={`https://${software.website || "#"}`}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {software.website}
                    </a>
                  </div>
                </div>

                <div>
                  <p className=" mb-1">Account Representative</p>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-slate-400 mr-1.5" />
                    <p className="font-medium ">
                      {software.accountRep || "Not assigned"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-1">Started Tracking</p>
                  <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 text-slate-400 mr-1.5" />
                    <p className="font-medium ">
                      {formatDate(software.createdAt, "MM/dd/yyyy")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className=" mb-1">Last Updated</p>
                  <div className="flex items-center">
                    <Info className="h-4 w-4 text-slate-400 mr-1.5" />
                    <p className="font-medium text-slate-700">
                      {formatDate(software.createdAt, "MM/dd/yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <p className=" mb-2 text-sm">Notes</p>
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-sm text-slate-700">
                  {software.notes || "No notes available."}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
