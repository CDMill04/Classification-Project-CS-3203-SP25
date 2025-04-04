export default function Courses() {
  return (
    <>
      <h2>Available Courses</h2>
      <p>Browse and enroll in courses from our catalog.</p>

      <div className="search-bar">
        <input type="text" placeholder="Search courses..." />
        <button>Search</button>
      </div>

      <div className="course-filters">
        <select>
          <option>All Categories</option>
          <option>Computer Science</option>
          <option>Mathematics</option>
          <option>Literature</option>
          <option>Science</option>
        </select>

        <select>
          <option>All Levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      <div className="course-grid">
        <div className="course-card">
          <h3>Introduction to Computer Science</h3>
          <p>Learn the fundamentals of programming and computer science concepts.</p>
          <div className="course-details">
            <span>Level: Beginner</span>
            <span>Duration: 12 weeks</span>
          </div>
          <button>Enroll Now</button>
        </div>

        <div className="course-card">
          <h3>Advanced Mathematics</h3>
          <p>Explore calculus, linear algebra, and statistical analysis.</p>
          <div className="course-details">
            <span>Level: Intermediate</span>
            <span>Duration: 16 weeks</span>
          </div>
          <button>Enroll Now</button>
        </div>

        <div className="course-card">
          <h3>English Literature</h3>
          <p>Study classic and contemporary literary works and critical analysis.</p>
          <div className="course-details">
            <span>Level: Intermediate</span>
            <span>Duration: 14 weeks</span>
          </div>
          <button>Enroll Now</button>
        </div>
      </div>
    </>
  )
}

