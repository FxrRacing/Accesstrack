"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface AdminNotesEditorProps {
  initialNotes: string
  userId: string
}

export function AdminNotesEditor({ initialNotes, userId }: AdminNotesEditorProps) {
  const [adminNotes, setAdminNotes] = useState(initialNotes)
  //console.info(userId)
  return (
    <Textarea
      id="notes"
      placeholder={`Add private notes about this user (only visible to admins) last updated by ${userId}`}
      className="h-20 resize-none"
      value={adminNotes}
      onChange={(e) => setAdminNotes(e.target.value)}
    />
  )
}
