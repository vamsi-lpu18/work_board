import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { getDepartmentById } from "@/app/actions/admin-organization";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const department = await getDepartmentById(id);

  if (!department) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/departments">
            <Button variant="ghost" size="icon">
              ←
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-muted-foreground">
              {department.name}
            </h2>
            <p className="text-muted-foreground">
              {department.description || "No description"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            + Add Team
          </Button>
          <Button variant="outline">Edit Department</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border border-border hover:bg-accent hover:shadow-xl transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-foreground">{department.users.length}</div>
            <p className="text-xs text-muted-foreground">
              {department.users.length === 1 ? "member" : "members"}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border hover:bg-accent hover:shadow-xl transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-foreground">{department.teams.length}</div>
            <p className="text-xs text-muted-foreground">
              {department.teams.length === 1 ? "team" : "teams"}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border hover:bg-accent hover:shadow-xl transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-foreground">
              {department.users.filter((u: any) => u.role === "MANAGER").length}
            </div>
            <p className="text-xs text-muted-foreground">active managers</p>
          </CardContent>
        </Card>

        <Card className="border border-border hover:bg-accent hover:shadow-xl transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Department Head
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Not assigned</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          <Card className="border border-border hover:bg-accent hover:shadow-xl transition-colors">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Teams in {department.name}</CardTitle>
              <CardDescription>
                All teams within this department
              </CardDescription>
            </CardHeader>
            <CardContent>
              {department.teams.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {department.teams.map((team: any) => (
                    <Card key={team.id} className="border border-border hover:bg-accent hover:shadow-xl transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <CardDescription>
                          {team.description || "No description"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Members:
                            </span>
                            <Badge variant="secondary">
                              {team._count.users}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full mt-2 border border-border hover:bg-accent transition-colors"
                            size="sm"
                          >
                            View Team
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No teams in this department
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card className="border border-border hover:bg-accent hover:shadow-xl transition-colors">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Department Members</CardTitle>
              <CardDescription>
                All users assigned to {department.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {department.users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {department.users.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "ADMIN" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.position || "-"}</TableCell>
                        <TableCell>{user.team?.name || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "ACTIVE"
                                ? "default"
                                : user.status === "INACTIVE"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/admin/users/${user.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No members in this department
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
