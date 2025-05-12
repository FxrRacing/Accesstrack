import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { IconKey, IconPlus } from "@tabler/icons-react";

export default function KeysAndCodesPage() {
    return (
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
    );
}