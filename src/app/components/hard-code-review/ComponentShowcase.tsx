import { 
  HCRButton, 
  SeverityBadge, 
  SummaryCard, 
  FindingCard,
  NextStepsSection,
  CodeComparison,
  LoadingSpinner,
  SkeletonLoader
} from "./index";

export function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-[#1F2937] text-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Hard Code Review - Component Showcase</h1>
          <p className="text-gray-300 text-lg">
            All components from the design system in one place for demonstration
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-500 pb-2">Buttons</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <HCRButton variant="primary">Primary Action</HCRButton>
              <HCRButton variant="secondary">Secondary Action</HCRButton>
              <HCRButton variant="danger">Danger Action</HCRButton>
              <HCRButton variant="ghost">Ghost Action</HCRButton>
            </div>
            <div className="flex flex-wrap gap-4">
              <HCRButton variant="primary" size="sm">Small</HCRButton>
              <HCRButton variant="primary" size="md">Medium</HCRButton>
              <HCRButton variant="primary" size="lg">Large</HCRButton>
            </div>
            <div className="flex flex-wrap gap-4">
              <HCRButton variant="primary" disabled>Disabled</HCRButton>
              <HCRButton variant="primary" loading>Loading...</HCRButton>
            </div>
          </div>
        </section>

        {/* Severity Badges Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-500 pb-2">Severity Badges</h2>
          <div className="flex flex-wrap gap-4">
            <SeverityBadge severity="critical" />
            <SeverityBadge severity="high" />
            <SeverityBadge severity="medium" />
            <SeverityBadge severity="low" />
            <SeverityBadge severity="info" />
          </div>
        </section>

        {/* Summary Cards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-500 pb-2">Summary Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              label="Overall Score"
              value="3.2/10"
              severity="critical"
              description="Your code needs work"
            />
            <SummaryCard
              label="Critical Issues"
              value="12"
              severity="critical"
              description="Must be fixed immediately"
            />
            <SummaryCard
              label="High Priority"
              value="8"
              severity="high"
              description="Should be addressed soon"
            />
            <SummaryCard
              label="Medium Priority"
              value="15"
              severity="medium"
              description="Consider fixing"
            />
          </div>
        </section>

        {/* Finding Cards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-500 pb-2">Finding Cards</h2>
          <div className="space-y-4">
            <FindingCard
              severity="critical"
              title="SQL Injection Vulnerability"
              description="You're directly concatenating user input into SQL queries. This is security 101. An attacker could drop your entire database."
              category="Security"
              lineNumbers="45-47"
              impact="Database compromise, data loss"
              effort="Easy fix - 10 minutes"
              codeSnippet='const query = "SELECT * FROM users WHERE id = " + userId;'
            />
            <FindingCard
              severity="high"
              title="Race Condition in Authentication"
              description="Your session check happens after the database query starts. A fast attacker could exploit this timing window."
              category="Security"
              lineNumbers="89-95"
              impact="Unauthorized access"
              effort="Medium fix - 1 hour"
            />
            <FindingCard
              severity="medium"
              title="Inefficient Database Query"
              description="You're loading the entire table into memory just to count rows. Use COUNT(*) instead."
              category="Performance"
              lineNumbers="120-125"
              impact="Slow response times"
              effort="Easy fix - 5 minutes"
            />
          </div>
        </section>

        {/* Code Comparison Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-500 pb-2">Code Comparison</h2>
          <CodeComparison
            before={`const query = "SELECT * FROM users WHERE id = " + userId;
db.execute(query);`}
            after={`const query = "SELECT * FROM users WHERE id = ?";
db.execute(query, [userId]);`}
            title="SQL Injection Fix"
            description="Use parameterized queries to prevent SQL injection attacks"
          />
        </section>

        {/* Next Steps Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-500 pb-2">Next Steps</h2>
          <NextStepsSection
            steps={[
              {
                title: "Fix Critical Security Issues",
                description: "Address all SQL injection and authentication vulnerabilities immediately",
                priority: "critical",
                estimatedTime: "2-3 hours"
              },
              {
                title: "Refactor Error Handling",
                description: "Your try-catch blocks are hiding errors instead of handling them properly",
                priority: "high",
                estimatedTime: "1-2 hours"
              },
              {
                title: "Optimize Database Queries",
                description: "Replace inefficient queries with proper indexed lookups",
                priority: "medium",
                estimatedTime: "3-4 hours"
              }
            ]}
          />
        </section>

        {/* Loading States Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-red-500 pb-2">Loading States</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Loading Spinner</h3>
              <div className="bg-[#374151] p-8 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Skeleton Loader</h3>
              <SkeletonLoader count={3} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
