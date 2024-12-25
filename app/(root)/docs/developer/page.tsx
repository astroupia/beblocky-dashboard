export default function DeveloperGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Developer Guide</h1>
        <p className="text-xl text-muted-foreground">
          Technical documentation for developers working with Beblocky Dashboard
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Architecture Overview</h2>
          <div className="prose text-muted-foreground">
            <p>Beblocky Dashboard is built with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Next.js 14 with App Router</li>
              <li>TypeScript for type safety</li>
              <li>Tailwind CSS for styling</li>
              <li>MongoDB Atlas for Cluster Managment</li>
              <li>Clerk Auth for authentication</li>
              <li>Shadcn/ui for UI components</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Models</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <h3 className="font-semibold mb-2">Course Model</h3>
              <pre className="text-sm">
                {`{
    courseId: Number,
    courseTitle: String,
    courseDescription: String,
    courseLanguage: String,
    subType: Enum["Free", "Premium", "Standard", "Gold"]
  }`}
              </pre>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <h3 className="font-semibold mb-2">Lesson Model</h3>
              <pre className="text-sm">
                {`{
    courseId: ObjectId,
    lessonTitle: String,
    lessonDescription: String,
    slides: [ObjectId]
  }`}
              </pre>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <h3 className="font-semibold mb-2">Slide Model</h3>
              <pre className="text-sm">
                {`{
    backgroundColor: String,
    color: String,
    title: String,
    titleFont: String,
    content: String,
    contentFont: String,
    startingCode: String,
    code: String,
    image: String
  }`}
              </pre>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Component Structure</h2>
          <div className="prose text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Dialogs/</strong> - Contains all modal components for
                course management
              </li>
              <li>
                <strong>UI/</strong> - Reusable UI components from shadcn/ui
              </li>
              <li>
                <strong>Layout/</strong> - Page layouts and navigation
                components
              </li>
              <li>
                <strong>Home/</strong> - Landing page components
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
