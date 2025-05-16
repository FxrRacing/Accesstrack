import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "./ui/button"

import { IconCirclePlusFilled } from "@tabler/icons-react"
import { AppWindow, User, Users } from "lucide-react"
export default function QuickAddTabs() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear w-full">
        <IconCirclePlusFilled />
        Quick Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Add</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="tab-1">
      <TabsList className="mx-auto flex w-full max-w-xs bg-transparent">
        <TabsTrigger
          value="tab-1"
          className="group data-[state=active]:bg-muted flex-1 flex-col p-3 text-md data-[state=active]:shadow-none"
        >
          <Badge className="mb-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50">
            <User />
          </Badge>
          Users
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="group data-[state=active]:bg-muted flex-1 flex-col p-3 text-md data-[state=active]:shadow-none"
        >
          <Badge className="mb-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50">
            <Users />
          </Badge>
          Shared Accounts
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          className="group data-[state=active]:bg-muted flex-1 flex-col p-3 text-md data-[state=active]:shadow-none"
        >
          <Badge className="mb-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50">
            <AppWindow />
          </Badge>
          Software
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1">
        <p className="text-muted-foreground p-4 text-center text-md">
          Content for Tab 1
        </p>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="text-muted-foreground p-4 text-center text-md">
          Content for Tab 2
        </p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="text-muted-foreground p-4 text-center text-md">
          Content for Tab 3
        </p>
      </TabsContent>
    </Tabs>
      </DialogContent>
    </Dialog>
  )
}
