"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, X } from "lucide-react";
import { AddMemberDialog } from "@/components/add-member-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Member {
  _id: string;
  username: string;
  name: string;
}

interface TeamDetails {
  _id: string;
  name: string;
  members: Member[];
}

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeamDetails();
  }, [params.id]);

  const fetchTeamDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 403) {
        setError("You do not have permission to view this team.");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch team details");
      const data = await response.json();
      setTeam(data);
    } catch (error) {
      console.error("Error fetching team details:", error);
      setError("Failed to load team details. Please try again.");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${params.id}/remove`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ memberId }),
        }
      );

      if (!response.ok) throw new Error("Failed to remove member");
      fetchTeamDetails();
    } catch (error) {
      console.error("Error removing member:", error);
      setError("Failed to remove member. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!team) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">wecommit</h1>
        <div className="text-sm font-medium">Team List</div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">team &gt; {team.name}</h2>
            <Button
              onClick={() => setIsAddMemberOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>

          <div className="space-y-4">
            {team.members.map((member) => (
              <Card key={member._id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{member.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.name}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(member._id)}
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <AddMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        teamId={params.id}
        onMemberAdded={() => {
          fetchTeamDetails();
          setIsAddMemberOpen(false);
        }}
      />
    </div>
  );
}
