'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import Layout from '@/app/components/Layout';
import LoginModal from '@/app/components/modals/loginPage';
import SignUpModal from '@/app/components/modals/SignUpPage';

export default function SchoolManagement() {
  const [role, setRole] = useState<'admin' | 'teacher'>('admin');

  const [schoolName, setSchoolName] = useState('');
  const [schools, setSchools] = useState<string[]>([]);

  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [joinedSchool, setJoinedSchool] = useState<string | null>(null);

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openLogin = () => {
    setLoginOpen(true);
    setSignUpOpen(false);
  };

  const openSignUp = () => {
    setLoginOpen(false);
    setSignUpOpen(true);
  };

  const closeAllModals = () => {
    setLoginOpen(false);
    setSignUpOpen(false);
  };

  const handleCreateSchool = () => {
    if (schoolName.trim() !== '') {
      setSchools(prev => [...prev, schoolName]);
      setSchoolName('');
    }
  };

  const handleJoinSchool = () => {
    if (selectedSchool) {
      setJoinedSchool(selectedSchool);
    }
  };

  const fakeLessonPlans: Record<string, string[]> = {
    'OU': ['Module 1 - Software Product', 'Module 2 - Agile Software Engineering', 'Module 3 - DevOps and Code Management'] 
  };

  const lessonPlans = joinedSchool ? fakeLessonPlans[joinedSchool] || [] : [];

  if (!isMounted) return null;

  return (
    <Layout>
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-background border-b">
        <h2 className="text-2xl font-bold">School Management</h2>
        <Button
          onClick={openLogin}
          className="bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg"
        >
          Log In
        </Button>
      </div>


      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Role Simulator */}
        <div className="p-6 rounded-2xl border shadow bg-card space-y-4">
          <h2 className="text-xl font-semibold">Role Simulator</h2>
          <div className="flex space-x-2">
            <Button
              variant={role === 'admin' ? 'default' : 'outline'}
              onClick={() => setRole('admin')}
            >
              Admin
            </Button>
            <Button
              variant={role === 'teacher' ? 'default' : 'outline'}
              onClick={() => setRole('teacher')}
            >
              Teacher
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Current role: {role}
          </p>
        </div>

        {/* Admin: Create School */}
        {role === 'admin' && (
          <div className="p-6 rounded-2xl border shadow bg-card space-y-4">
            <h2 className="text-xl font-semibold">Create a School</h2>
            <Input
              placeholder="Enter school name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
            <Button onClick={handleCreateSchool}>Create School</Button>
            {schools.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mt-4">Existing Schools:</h3>
                <ul className="list-disc list-inside">
                  {schools.map((school, index) => (
                    <li key={index}>{school}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Teacher: Join School */}
        {role === 'teacher' && (
          <div className="p-6 rounded-2xl border shadow bg-card space-y-4">
            <h2 className="text-xl font-semibold">Join a School</h2>
            {schools.length > 0 ? (
              <>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Select a school</option>
                  {schools.map((school, index) => (
                    <option key={index} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
                <Button onClick={handleJoinSchool} disabled={!selectedSchool}>
                  Join
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground">
                No schools available. Please wait for an admin to create one.
              </p>
            )}
          </div>
        )}

        {/* Teacher: View Lesson Plans */}
        {role === 'teacher' && joinedSchool && (
          <div className="p-6 rounded-2xl border shadow bg-card space-y-4">
            <h2 className="text-xl font-semibold">
              Lesson Plans for {joinedSchool}
            </h2>
            {lessonPlans.length > 0 ? (
              <ul className="list-disc list-inside">
                {lessonPlans.map((lesson, index) => (
                  <li key={index}>{lesson}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                No lesson plans available for this school yet.
              </p>
            )}
          </div>
        )}

        {/* Teacher: No School Joined */}
        {role === 'teacher' && !joinedSchool && (
          <div className="p-6 rounded-2xl border shadow bg-card">
            <p className="text-muted-foreground">
              You have not joined a school yet.
            </p>
          </div>
        )}
      </div>

      {/* Login and Sign Up Modals */}

      {isMounted && (
        <>
          <LoginModal
            isOpen={isLoginOpen}
            onClose={closeAllModals}
            openSignUp={openSignUp}
          />
          <SignUpModal
            isOpen={isSignUpOpen}
            onClose={closeAllModals}
            openLogin={openLogin}
          />
        </>
      )}
    </Layout>
  );
}
