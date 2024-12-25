export default function AdminGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Administrator Guide</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to manage courses, users, and system settings
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Course Management</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Creating a New Course</h3>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                <li>Navigate to the Courses dashboard</li>
                <li>Click -Create Course- button</li>
                <li>Fill in course details (title, description, language)</li>
                <li>Add lessons to your course</li>
                <li>Create slides for each lesson</li>
                <li>Review and publish your course</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Managing Lessons</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Edit lesson content and structure</li>
                <li>Reorder lessons within a course</li>
                <li>Add or remove slides</li>
                <li>Set lesson prerequisites</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Slide Creation</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Customize slide appearance (colors, fonts)</li>
                <li>Add text content and formatting</li>
                <li>Include code snippets</li>
                <li>Upload and manage images</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <div className="p-4 rounded-lg border border-border">
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>View and manage user accounts</li>
              <li>Assign user roles and permissions</li>
              <li>Monitor user activity and progress</li>
              <li>Generate user reports</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Analytics & Reporting</h2>
          <div className="p-4 rounded-lg border border-border">
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Track course completion rates</li>
              <li>Monitor user engagement</li>
              <li>View detailed analytics</li>
              <li>Generate custom reports</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
