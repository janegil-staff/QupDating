"use client";
import PublicProfile from "@/components/PublicProfile";
import { useParams } from "next/navigation";

export default function ProfilePage({ params }) {
  const { id } = useParams();

  return <PublicProfile userId={id} />;
}
