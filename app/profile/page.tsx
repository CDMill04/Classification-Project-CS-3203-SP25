export default function Profile() {
  return (
    <>
      <h2>User Profile</h2>
      <p>Manage your personal information and settings.</p>

      <div className="profile-section">
        <h3>Personal Information</h3>
        <form>
          <div className="form-group">
            <label>Full Name:</label>
            <input type="text" placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" placeholder="john.doe@example.com" />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <select>
              <option>Student</option>
              <option>Educator</option>
              <option>Administrator</option>
            </select>
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </div>

      <div className="profile-section">
        <h3>Account Settings</h3>
        <form>
          <div className="form-group">
            <label>Change Password:</label>
            <input type="password" placeholder="New password" />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input type="password" placeholder="Confirm new password" />
          </div>
          <button type="submit">Update Password</button>
        </form>
      </div>
    </>
  )
}

