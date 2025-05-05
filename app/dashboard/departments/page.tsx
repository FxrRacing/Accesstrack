
import { GradientCard } from "@/components/ui/gradient-card";
import { IconBuildingCommunity} from "@tabler/icons-react";
import AddDepartmentForm from "./addDepartmentForm";

export default function DepartmentsPage() {
    return (<div className="flex flex-col gap-4 p-3">
      <h1 className="text-2xl font-bold">Departments</h1>
      <GradientCard
        title="Create Department"
        description="Create a new department"
        badge="Create"
        icon={<IconBuildingCommunity className="h-20 w-20" strokeWidth={1.5} />}
        gradientFrom="from-amber-500"
        gradientTo="to-orange-600"
      >
       <AddDepartmentForm />
      </GradientCard>

      
    </div>
    
  );   
}
