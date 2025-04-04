export default function Dashboard() {
  return (
    <>
      <h2>Dashboard</h2>
      <p>View your learning progress and upcoming assignments.</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Current Courses</h3>
          <ul>
            <li>Introduction to Computer Science</li>
            <li>Advanced Mathematics</li>
            <li>English Literature</li>
          </ul>
        </div>

        <div className="dashboard-card">
          <h3>Upcoming Assignments</h3>
          <ul>
            <li>CS101 Project - Due Apr 15</li>
            <li>Math Quiz - Due Apr 10</li>
            <li>Literature Essay - Due Apr 20</li>
          </ul>
        </div>

        <div className="dashboard-card">
          <h3>Recent Grades</h3>
          <ul>
            <li>CS101 Midterm - 92%</li>
            <li>Math Assignment - 88%</li>
            <li>Literature Discussion - 95%</li>
          </ul>
        </div>

        <div className="dashboard-card">
          <h3>Learning Progress</h3>
          <div className="progress-bar">
            <div className="progress" style={{ width: "75%" }}>
              75%
            </div>
          </div>
          <p>Overall completion rate for current semester</p>
        </div>
      </div>
    </>
  )
}

