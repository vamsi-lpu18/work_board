"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateTeamDialog } from "@/components/admin/CreateTeamDialog";
import { EditTeamDialog } from "@/components/admin/EditTeamDialog";
import { DeleteTeamDialog } from "@/components/admin/DeleteTeamDialog";

interface TeamsClientProps {
  initialTeams: any[];
  departments: any[];
}

export function TeamsClient({ initialTeams, departments }: TeamsClientProps) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editTeam, setEditTeam] = useState<any>(null);
  const [deleteTeam, setDeleteTeam] = useState<any>(null);

  return (
    <>
      <div className="p-6 md:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-foreground ">
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Admin - Teams
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage organizational teams and their members
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setOpenCreateDialog(true)}
              className="bg-foreground hover:bg-foreground/90 text-background transition-colors"
            >
              + Add Team
            </Button>
          </div>

          {initialTeams.length === 0 ? (
            <Card className="border border-border hover:bg-accent transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <span className="text-4xl mb-4"></span>
                <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by creating your first team
                </p>
                <Button 
                  onClick={() => setOpenCreateDialog(true)}
                  className="bg-foreground hover:bg-foreground/90 text-background"
                >
                  + Create Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {initialTeams.map((team) => (
                <Card 
                  key={team.id}
                  className="border border-border hover:bg-accent transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          👥 {team.name}
                        </CardTitle>
                      <CardDescription className="mt-1.5">
                        {team.description || "No description"}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          ⋮
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditTeam(team)}>
                          ✏️ Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteTeam(team)}
                          className="text-destructive"
                        >
                          🗑️ Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium text-muted-foreground">{team.department.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Members:</span>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          {team._count.users}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Projects:</span>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          {team._count.projects}
                        </Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2 border-border hover:bg-muted hover:text-foreground transition-all"
                      >
                        View Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateTeamDialog 
        open={openCreateDialog} 
        onOpenChange={setOpenCreateDialog}
        departments={departments}
      />

      {editTeam && (
        <EditTeamDialog
          open={!!editTeam}
          onOpenChange={(open) => !open && setEditTeam(null)}
          team={editTeam}
          departments={departments}
        />
      )}

      {deleteTeam && (
        <DeleteTeamDialog
          open={!!deleteTeam}
          onOpenChange={(open) => !open && setDeleteTeam(null)}
          team={deleteTeam}
        />
      )}
    </>
  );
}
