export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-primary"> Beblocky Dahshboard</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive course management and learning platform
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="text-muted-foreground">
            Beblocky Dashboard is a powerful course management system designed
            for educational institutions, online learning platforms, and
            corporate training programs with IDE. It provides a robust set of
            tools for creating, managing, and delivering educational content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Key Features</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-6">
            <li>Course Creation and Management</li>
            <li>Interactive Lesson Builder</li>
            <li>Slide-based Content Presentation</li>
            <li>User Role Management</li>
            <li>Progress Tracking</li>
            <li>Real-time Analytics</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <div className="grid gap-4">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">For Administrators</h3>
              <p className="text-muted-foreground">
                Start by accessing the admin dashboard to manage courses, users,
                and system settings. Visit the Admin Guide section for detailed
                instructions.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">For Developers</h3>
              <p className="text-muted-foreground">
                Check out our Developer Guide for API documentation, integration
                guides, and customization options.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
