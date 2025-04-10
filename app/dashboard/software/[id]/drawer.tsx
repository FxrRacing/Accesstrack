"use client";
import { Software } from "@prisma/client";

import { editSoftware } from "@/actions/software_actions";


export  function Drawer({ software }: { software: Software }) {

   
   
  return (
    <>
    Edit
     <div className="flex justify-start p-1">
      
      <form action={editSoftware} className="flex flex-col gap-4">
        <input type="hidden" name="id" defaultValue={software.id} />
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" defaultValue={software.name} />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          name="description"
          defaultValue={software.description || ""}
        />

        <label htmlFor="notes">Notes:</label>
        <textarea
          name="notes"
          id="notes"
          rows={3}
          defaultValue={software.notes || ""}
        ></textarea>
        <label htmlFor="status">Status:</label>
        <select name="status" id="status" defaultValue={software.status || ""}>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
        <label htmlFor="category">Category:</label>
        <select
          name="category"
          id="category"
          defaultValue={software.category || ""}
        >
          <option value="web">Web</option>
          <option value="software">Software</option>
          <option value="hardware">Hardware</option>
          <option value="network">Network</option>
          <option value="other">Other</option>
        </select>
   
        <button type="submit" onClick={() => console.log("Update button clicked")}>
        Update
        </button>

      </form>
      </div>
    </>
  );
}
