"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CreateTeamDialog } from "@/components/create-team-dialog";

interface Team {
  _id: string;
  name: string;
  members: string[];
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch teams");
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">wecommit</h1>
        <div className="text-sm font-medium">Team List</div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Team List</h2>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>

          <div className="space-y-4">
            {teams.map((team) => (
              <Card
                key={team._id}
                className="p-4 hover:shadow-lg transition-shadow"
              >
                <Link
                  href={`/teams/${team._id}`}
                  className="flex justify-between items-center"
                >
                  <span className="text-lg font-medium">{team.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {team.members.length} members
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <CreateTeamDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onTeamCreated={() => {
          fetchTeams();
          setIsCreateOpen(false);
        }}
      />
    </div>
  );
}
