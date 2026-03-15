import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  HiSquares2X2, 
  HiUserGroup, 
  HiFolder, 
  HiArrowTrendingUp,
  HiSparkles,
  HiArrowRight,
  HiCheckCircle,
  HiShieldCheck,
  HiChartBar,
  HiBolt,
  HiEnvelope,
} from "react-icons/hi2";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/ModeToggle";
import VortexDemo from "@/components/vortex-demo";

export const metadata = {
  title: "WorkBoard | AI-Powered Workforce Management",
};

export default async function Home() {
  const session = await auth();

  // If user is logged in, redirect to their role-specific dashboard
  if (session?.user) {
    const userRole = session.user.role || "EMPLOYEE";
    
    switch (userRole) {
      case "ADMIN":
        redirect("/admin");
      case "MANAGER":
        redirect("/manager");
      case "LEAD":
        redirect("/lead");
      case "EMPLOYEE":
      default:
        redirect("/employee");
    }
  }

  // Public landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/50 border-b border-transparent [&:hover]:border-border transition-colors">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
                  <HiSquares2X2 className="h-4 w-4 text-background" />
                </div>
                <span className="text-base font-semibold text-foreground">
                  WorkBoard
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                <a href="#features" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50">Showcase</a>
                <a href="#how-it-works" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50">Docs</a>
                <a href="#roles" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50">Enterprise</a>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="text-sm h-8 rounded-lg bg-foreground text-background hover:bg-foreground/90">
                  Get Started
                  <HiArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main >
        <section className="relative overflow-hidden min-h-screen flex items-center">
          <VortexDemo>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
              <div className="text-center max-w-4xl mx-auto space-y-6">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold text-foreground leading-[1.08] tracking-tighter">
                  Where teams do<br />
                  their best work
                </h1>
              
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  One platform for managing projects, tracking performance, and
                  empowering every role on your team — from employees to executives.
                </p>
              
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/auth/signup">
                    <Button size="lg" className="h-12 px-7 text-base font-medium bg-foreground text-background hover:bg-foreground/90 rounded-lg">
                      Start Free Trial
                      <HiArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button size="lg" variant="outline" className="h-12 px-7 text-base font-medium rounded-lg border-border">
                      Sign In
                    </Button>
                  </Link>
                </div>

                {/* Social proof */}

                  <p className="text-sm text-muted-foreground">
                    Trusted by <span className="font-semibold text-foreground">50+</span> teams worldwide
                  </p>
                </div>
              </div>
            </div>
          </VortexDemo>
        </section>

        {/* Why WorkBoard */}
        <section id="features" className="">
          <div className="max-w-[1200px] mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Why WorkBoard?
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-3">
                A complete toolkit for modern workforce management — built for speed, designed for scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border border-border">
              <div className="bg-background p-8 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-5">
                  <HiUserGroup className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">Employee Management</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track tasks, timesheets, goals, and performance reviews all in one place.
                </p>
              </div>

              <div className="bg-background p-8 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-5">
                  <HiFolder className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">Project Tracking</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Manage projects, sprints, and team workload with Kanban boards and analytics.
                </p>
              </div>

              <div className="bg-background p-8 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-5">
                  <HiSparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get intelligent recommendations, automated reports, and predictive analytics.
                </p>
              </div>

              <div className="bg-background p-8 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-5">
                  <HiChartBar className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">Performance Analytics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Real-time dashboards and reports to measure productivity and progress.
                </p>
              </div>

              <div className="bg-background p-8 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-5">
                  <HiShieldCheck className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Secure dashboards for Admin, Manager, Lead, and Employee roles.
                </p>
              </div>

              <div className="bg-background p-8 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-500 to-red-500 flex items-center justify-center mb-5">
                  <HiBolt className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">Automation Tools</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Automate approvals, notifications, and repetitive workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t border-border">
          <div className="max-w-[1200px] mx-auto px-6 py-24">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-center">
                Up and running in minutes
              </h2>
              <p className="text-sm text-muted-foreground text-center mt-3 mb-16">
                Three simple steps to transform how your team works
              </p>

              <div className="space-y-0">
                <div className="relative flex gap-6 pb-12">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground bg-background text-sm font-bold text-foreground">
                      1
                    </div>
                    <div className="flex-1 w-px bg-border mt-3" />
                  </div>
                  <div className="pt-1.5 pb-8">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Create your account</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Sign up and set up your organization profile in under two minutes. No credit card required.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-6 pb-12">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground bg-background text-sm font-bold text-foreground">
                      2
                    </div>
                    <div className="flex-1 w-px bg-border mt-3" />
                  </div>
                  <div className="pt-1.5 pb-8">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Invite your team</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Add team members and assign roles based on their responsibilities. Everyone gets a tailored dashboard.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground bg-foreground text-sm font-bold text-background">
                      3
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Start managing</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Access your personalized dashboard and start tracking work immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Role-Specific Dashboards */}
        <section id="roles" className="border-t border-border">
          <div className="max-w-[1200px] mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Built for every role
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-3">
                Each role gets a purpose-built workspace with the tools they need
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group relative rounded-lg border border-border bg-background p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <HiShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">Admin Dashboard</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Full system control with user management, organization settings, and analytics.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">User & role management</span>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Organization settings</span>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Audit logs & security</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-lg border border-border bg-background p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <HiArrowTrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">Manager Dashboard</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Team oversight with approvals, performance reviews, and resource optimization.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Timesheet & PTO approvals</span>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Team analytics</span>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">AI insights</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-lg border border-border bg-background p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <HiFolder className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">Lead Dashboard</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sprint management with task boards, code reviews, and team coordination.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Sprint planning</span>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Task prioritization AI</span>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Code review</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-lg border border-border bg-background p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <HiUserGroup className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">Employee Dashboard</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Personal workspace with tasks, timesheets, goals, and performance tracking.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Task management</span>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Time tracking</span>
                      <span className="inline-flex items-center text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">Goals & performance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border">
          <div className="max-w-[1200px] mx-auto px-6 py-24">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Ready to get started?
              </h2>
              <p className="text-sm text-muted-foreground mt-3 mb-8">
                Join teams already using WorkBoard to streamline their operations and boost productivity.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/auth/signup">
                  <Button size="lg" className="h-11 px-6 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90">
                    Start Free Trial
                    <HiArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="h-11 px-6 text-sm font-medium rounded-lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 sm:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center">
                  <HiSquares2X2 className="h-3.5 w-3.5 text-background" />
                </div>
                <span className="text-sm font-semibold text-foreground">WorkBoard</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                AI-powered workforce management for modern teams.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Tools</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Integrations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API Reference</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} WorkBoard, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <FaGithub className="h-4 w-4" />
              </Link>
              <Link href="https://x.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="X">
                <FaXTwitter className="h-4 w-4" />
              </Link>
              <Link href="mailto:support@makeitpossible.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                <HiEnvelope className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
