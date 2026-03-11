import { redirect } from "next/navigation";
import { FaGithub, FaSlack } from "react-icons/fa";

import { auth } from "@/lib/auth";
import { getAllIntegrations } from "@/app/actions/admin-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function IntegrationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const integrations = await getAllIntegrations();

  // Default integrations if none exist
  const defaultIntegrations = [
    { name: "GitHub", type: "github", enabled: false, description: "Connect GitHub repositories for project tracking" },
    { name: "Slack", type: "slack", enabled: false, description: "Team communication and notifications" },
    { name: "Microsoft Teams", type: "teams", enabled: false, description: "Collaboration and chat integration" },
    { name: "Email", type: "email", enabled: true, description: "Email notifications and alerts" },
    { name: "SSO", type: "sso", enabled: false, description: "Single Sign-On authentication" },
    { name: "AI Assistant", type: "ai", enabled: true, description: "AI-powered suggestions and automation" },
  ];

  const displayIntegrations = integrations && integrations.length > 0 
    ? integrations.map(i => ({
        name: i.name,
        type: i.type,
        enabled: i.enabled,
        description: `Integration for ${i.name}`,
      }))
    : defaultIntegrations;

  return (
    <div className="space-y-6">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Header with gradient badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-foreground ">
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-muted-foreground">
              Integrations
            </h2>
            <p className="text-muted-foreground mt-1">
              Connect external services and configure integrations
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayIntegrations.map((integration) => {
            return (
              <Card 
                key={integration.name}
                className="border border-border hover:bg-accent transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={integration.enabled ? "default" : "secondary"}
                      className={integration.enabled ? "bg-foreground text-background" : ""}
                    >
                      {integration.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant={integration.enabled ? "outline" : "default"} 
                    className={integration.enabled 
                      ? "w-full hover:bg-muted transition-all"
                      : "w-full bg-foreground hover:bg-foreground/90 text-background"
                    }
                  >
                    {integration.enabled ? "Configure" : "Enable"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
