
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { prisma } from "@/lib/prisma";
import { IconKey, IconPlus } from "@tabler/icons-react";
import KeyForm from "./keyForm";
import CardForm from "./cardForm";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function KeysAndCodesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user) {
    redirect('/login')
  }
  const keys = await prisma.key.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      location: true,
      door: true,
      user: true,
    },
  });
  const cards = await prisma.keyCard.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const locations = await prisma.location.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const staff= await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });
 
    return (
        <>
        <div className="flex flex-col gap-4 p-3">
      <h1 className="text-2xl font-bold">Keys and Codes</h1>
      <GradientCard
        title="Create Key"
        description="Create a new key"
        badge="Create"
        icon={<IconKey className="h-20 w-20" strokeWidth={1.5} />}
        gradientFrom="from-fuchsia-500"
        gradientTo="to-violet-600"
      >
      <Button className="rounded-full">
        <IconPlus className="h-4 w-4" />
        Create</Button>
      </GradientCard>

      </div>
      <div className="flex flex-col gap-4 p-3">
        <h1 className="text-2xl font-bold">Keys</h1>
        <div className="flex flex-col gap-4">
          {keys.map((key) => (
            <div key={key.id}>{key.name} - {key.type} - {key.location?.name} - {key.door?.name} - {key.user?.name}</div> 
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-3">
        <h1 className="text-2xl font-bold">Key Cards</h1>
        <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <div key={card.id}>{card.name} </div>
          ))}
        </div>
      </div>


<h3 className="text-2xl font-bold">Create Key</h3>
<KeyForm staff={staff} locations={locations} />
<Separator /> 
<h3 className="text-2xl font-bold">Create Key Card</h3>
<CardForm staff={staff} locations={locations} />
      </>
      

    

      
   
    );
}