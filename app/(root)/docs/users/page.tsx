export default function UserManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">User Management Guide</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive guide for managing users and roles
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">User Roles</h2>
          <div className="grid gap-4">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Administrator</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Full system access</li>
                <li>Manage all courses and users</li>
                <li>Access to analytics and reports</li>
                <li>System configuration</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Instructor</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Create and manage own courses</li>
                <li>View student progress</li>
                <li>Access course analytics</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Student</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access enrolled courses</li>
                <li>Track personal progress</li>
                <li>Interact with course content</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">User Management Tasks</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Adding New Users</h3>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                <li>Navigate to User Management</li>
                <li>Click &ldquo;Add User&ldquo;</li>
                <li>Enter user details</li>
                <li>Assign appropriate role</li>
                <li>Set initial password</li>
                <li>Send welcome email</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Managing Permissions</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Review and modify user roles</li>
                <li>Set course access permissions</li>
                <li>Configure feature access</li>
                <li>Manage administrative privileges</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
