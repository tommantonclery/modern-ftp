import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import DashboardShell from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const totalConnections = await db.sftpConnection.count({
    where: { userId: session.user.id },
  });

  const totalFiles = 0;
  const totalStorage = "—";

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Welcome back, {session.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here’s a snapshot of your account.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-all duration-200 border border-muted rounded-xl">
            <CardHeader>
              <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                SFTP Connections
              </CardTitle>
              <CardDescription>Active & saved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {totalConnections}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200 border border-muted rounded-xl">
            <CardHeader>
              <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                Files Uploaded
              </CardTitle>
              <CardDescription>Total across all servers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {totalFiles}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200 border border-muted rounded-xl">
            <CardHeader>
              <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                Storage Used
              </CardTitle>
              <CardDescription>Based on sync + uploads</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {totalStorage}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
