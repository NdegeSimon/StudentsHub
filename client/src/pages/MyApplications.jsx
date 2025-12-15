

export default function MyApplications() {
  const applications = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechNova Ltd",
      status: "Under Review",
      date: "12 Dec 2025",
      type: "Remote",
    },
    {
      id: 2,
      title: "Backend API Engineer",
      company: "CloudWorks",
      status: "Shortlisted",
      date: "9 Dec 2025",
      type: "Contract",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Creative Hub",
      status: "Rejected",
      date: "2 Dec 2025",
      type: "On-site",
    },
  ];

  const statusStyles = {
    "Under Review": "bg-purple-50 text-purple-700 border-purple-200",
    Shortlisted: "bg-purple-100 text-purple-800 border-purple-300",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              My Applications
            </h1>
            <p className="text-gray-500 mt-2">
              Monitor your job applications and follow their progress
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-6 md:mt-0">
            <div className="bg-white border rounded-xl px-5 py-3 text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-800">
                {applications.length}
              </p>
            </div>
            <div className="bg-white border rounded-xl px-5 py-3 text-center">
              <p className="text-sm text-gray-500">Shortlisted</p>
              <p className="text-2xl font-bold text-green-600">1</p>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-5">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-gradient-to-br from-purple-50 via-white to-white border border-purple-100 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between hover:shadow-xl hover:border-purple-200 transition"
            >
              {/* Left */}
              <div className="flex gap-4">
                {/* Company Logo Placeholder */}
                <div className="h-14 w-14 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  {app.company.charAt(0)}
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {app.title}
                  </h2>
                  <p className="text-sm text-gray-500">{app.company}</p>
                  <div className="flex gap-3 text-xs text-gray-400 mt-2">
                    <span>{app.type}</span>
                    <span>•</span>
                    <span>Applied on {app.date}</span>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4 mt-5 lg:mt-0">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                    statusStyles[app.status]
                  }`}
                >
                  {app.status}
                </span>

                <button className="px-4 py-2 rounded-full border border-purple-200 text-sm font-medium text-purple-700 hover:bg-purple-50">
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {applications.length === 0 && (
          <div className="bg-white border rounded-2xl p-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              No applications yet
            </h2>
            <p className="text-gray-500 mt-3">
              Start applying for jobs and track them here.
            </p>
            <button className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700">
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
