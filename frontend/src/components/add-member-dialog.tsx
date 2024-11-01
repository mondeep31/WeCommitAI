"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  onMemberAdded: () => void;
}

interface Employee {
  _id: string;
  username: string;
  name: string;
}

export function AddMemberDialog({
  open,
  onOpenChange,
  teamId,
  onMemberAdded,
}: AddMemberDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/employees/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to search employees");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (employeeId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/addMember`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId }),
        }
      );

      if (!response.ok) throw new Error("Failed to add member");
      onMemberAdded();
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {searchResults.map((employee) => (
              <div
                key={employee._id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div>
                  <p className="font-medium">{employee.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {employee.name}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddMember(employee._id)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
