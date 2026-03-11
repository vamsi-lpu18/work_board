import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { getUserById } from "@/app/actions/admin-users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  const initials = `${user.firstName?.[0] || ""}${
    user.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/users">
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                ←
              </Button>
            </Link>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-muted-foreground">
                Admin - User Details
              </h2>
              <p className="text-muted-foreground mt-1">
                View and manage user information
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border hover:bg-muted">
              Edit User
            </Button>
            <Button variant="outline" className="border-border hover:bg-muted">
              Reset Password
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-1 border border-border hover:bg-accent hover:shadow-xl transition-colors">
            <CardHeader>
              <CardTitle className="text-xl">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-muted-foreground">
                  {user.position || "No position"}
                </p>
                <Badge
                  className="mt-2"
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
                <Badge
                  className="mt-2"
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
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {user.phoneNumber}
                    </span>
                  </div>
                )}
                {user.department && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {user.department.name}
                    </span>
                  </div>
                )}
                {user.team && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {user.team.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border border-border hover:bg-accent hover:shadow-xl transition-colors">
            <Tabs defaultValue="overview" className="w-full">
              <CardHeader>
                <TabsList className="bg-muted">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="accounts">Accounts</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Manager
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {user.manager ? (
                          <div>
                            <div className="text-2xl font-bold">
                              {user.manager.firstName} {user.manager.lastName}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {user.manager.email}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No manager assigned
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Direct Reports
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {user.employees?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {user.employees?.length === 1
                            ? "employee"
                            : "employees"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Email Verified
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {user.emailVerified ? "Yes" : "No"}
                        </div>
                        {user.emailVerified && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(user.emailVerified).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Last Updated
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {new Date(user.updatedAt).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.updatedAt).toLocaleTimeString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="team">
                  <Card className="border-foreground/50">
                    <CardHeader>
                      <CardTitle>Direct Reports</CardTitle>
                      <CardDescription>
                        Employees reporting to this user
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {user.employees && user.employees.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Position</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {user.employees.map((employee: any) => (
                              <TableRow key={employee.id}>
                                <TableCell className="font-medium">
                                  {employee.firstName} {employee.lastName}
                                </TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>
                                  {employee.position || "-"}
                                </TableCell>
                                <TableCell>
                                  <Link href={`/admin/users/${employee.id}`}>
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
                          No direct reports
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance">
                  <Card className="border-foreground/50">
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>Recent performance data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {user.performanceMetrics &&
                      user.performanceMetrics.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Work Quality</TableHead>
                              <TableHead>Communication</TableHead>
                              <TableHead>Teamwork</TableHead>
                              <TableHead>Initiative</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {user.performanceMetrics.map((metric: any) => (
                              <TableRow key={metric.id}>
                                <TableCell>
                                  {new Date(
                                    metric.recordedAt
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{metric.workQuality}/5</TableCell>
                                <TableCell>{metric.communication}/5</TableCell>
                                <TableCell>{metric.teamwork}/5</TableCell>
                                <TableCell>{metric.initiative}/5</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No performance metrics recorded
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="accounts">
                  <Card className="border-foreground/50">
                    <CardHeader>
                      <CardTitle>Linked Accounts</CardTitle>
                      <CardDescription>
                        OAuth providers and authentication methods
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {user.accounts && user.accounts.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Provider</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Linked</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {user.accounts.map((account: any) => (
                              <TableRow key={account.id}>
                                <TableCell className="font-medium capitalize">
                                  {account.provider}
                                </TableCell>
                                <TableCell className="capitalize">
                                  {account.type}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Connected</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No linked accounts
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
