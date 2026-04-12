import { useState } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  // Backend allows updating: name, codingLevel, role
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
  });
  const [passForm, setPassForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading]       = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await authService.updateMe(profileForm);
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setProfileLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword)
      return toast.error('Passwords do not match');
    if (passForm.newPassword.length < 6)
      return toast.error('Min 6 characters');
    setPassLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      toast.success('Password changed!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally { setPassLoading(false); }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-desc">Manage your account</p>
      </div>
      <div className="profile-grid">
        <div className="profile-avatar-card">
          <div className="big-avatar">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="avatar-username">{user?.name}</div>
          <div className="avatar-email">{user?.email}</div>
          <div className="avatar-role" style={{ marginTop: 8 }}>
            <span className={`badge ${user?.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>
              {user?.role || 'user'}
            </span>
          </div>
          {user?.codingLevel && (
            <div style={{ marginTop: 8 }}>
              <span className="badge badge-amber">{user.codingLevel}</span>
            </div>
          )}
        </div>

        <div className="profile-forms">
          <div className="profile-card">
            <h3 className="card-title">Update Profile</h3>
            <form onSubmit={handleProfileUpdate} className="auth-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  required />
              </div>
              <button className="btn-primary" type="submit" disabled={profileLoading}>
                {profileLoading ? <span className="spinner"></span> : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="profile-card">
            <h3 className="card-title">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="auth-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={passForm.currentPassword}
                  onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="Min 6 characters"
                  value={passForm.newPassword}
                  onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                  minLength={6} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={passForm.confirmPassword}
                  onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                  required />
              </div>
              <button className="btn-primary" type="submit" disabled={passLoading}>
                {passLoading ? <span className="spinner"></span> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}