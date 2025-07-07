"use client"

import { Suspense } from "react"
import NewReservationForm from "./NewReservationForm"

export default function NewUserReservationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewReservationForm />
    </Suspense>
  )
} 