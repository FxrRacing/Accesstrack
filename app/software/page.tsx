import { prisma } from "@/lib/prisma";
import Link from "next/link";


export default async function SoftwarePage() {  
   const software= await prisma.software.findMany({});
    return (
        <div>
            <h1>Software</h1>
            <p>Software page content goes here.</p>
            {software.map((software) => (
               
                <div key={software.id}>
                     <Link  href={`/software/${software.id}`}><h2>{`--->`}{software.name}</h2></Link>
                    
                    <p className="text-green-700">{software.description}</p>
                </div>
               
            ))}
        </div>
    );
}