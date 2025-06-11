'use client'

//import InviteForm from './invite/page';
import Appearance from './appearance/page';

//returns an invite form will be transformed into a componennt in the settings page
export default function Settings() {
    
  
    return (
        <main className="p-4">
      
{/* <InviteForm /> */}
            <Appearance />
        </main>
    )
}

