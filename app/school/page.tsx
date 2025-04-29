"use client";

import { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import { Button } from "@/app/components/ui/button";
import useCurrentUser from "@/app/hooks/useCurrentUser";
import LoginModal from "@/app/components/modals/loginPage";
import SignUpModal from "@/app/components/modals/SignUpPage";
import { getAllSchools, getAllUsers, createSchool, joinSchool, updateUser, promoteToAdmin, getLessonPlansForSchool } from "./actions";


export default function SchoolManagement() {
  const { user, isMounted } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"choose" | "create" | "join" | "admin" | "teacher">("choose");
  const [schoolName, setSchoolName] = useState("");
  const [availableSchools, setAvailableSchools] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [myRole, setMyRole] = useState("");
  const [mySchool, setMySchool] = useState("");
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);

  
  
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



  useEffect(() => {
    if (user) {
      init();
    }
  }, [user]);

  const init = async () => {
    const allUsers = await getAllUsers();
    const currentUser = allUsers.find((u: any) => u.email === user?.email);

    if (currentUser?.role && currentUser?.school) {
      setMyRole(currentUser.role);
      setMySchool(currentUser.school);
      setView(currentUser.role === "admin" ? "admin" : "teacher");
      loadLessonPlans();
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!schoolName) return;
    await createSchool(schoolName, user?.email!);
    await updateUser(user?.email!, { role: "admin", school: schoolName });
    setMyRole("admin");
    setMySchool(schoolName);
    setView("admin");
  };

  const handleJoin = async () => {
    if (!selectedSchool) return;
    await joinSchool(selectedSchool, user?.email!);
    await updateUser(user?.email!, { role: "teacher", school: selectedSchool });
    setMyRole("teacher");
    setMySchool(selectedSchool);
    setView("teacher");
  };

  const loadSchools = async () => {
    const schools = await getAllSchools();
    setAvailableSchools(schools.map((s: any) => s.name));
  };

  const promoteTeacher = async (email: string) => {
    await promoteToAdmin(mySchool, email);
    await updateUser(email, { role: "admin" });
    init();
  };

  const loadLessonPlans = async () => {
    const plans = await getLessonPlansForSchool(mySchool); // make this a fetch user uploads thing tommorow
    setLessonPlans(plans);
  };

  if (!isMounted || loading) {
    return (
      <Layout>
        <div className="flex flex-1 flex-col items-center justify-start text-center px-8 pt-16 h-[calc(100vh-64px)]">
          <img 
            src="/broken_pencil.png" 
            alt="Broken Pencil" 
            className="w-64 h-64 mb-6 object-contain" 
          />
          <p className="text-2xl font-semibold text-muted-foreground">
            Oops! You must be logged in to view the Dashboard.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      { /* Top Bar */}
      <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-background border-b">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>
        <Button
          onClick={openLogin}
          className="bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg"
        >
          Log In
        </Button>
      </div>
      {/* Success Message */}
      {logoutMessage && (
        <div className="p-4 bg-green-100 text-green-800 text-center rounded-lg mt-6 mx-4">
          Logout successful!
        </div>
      )}
      <div className="p-6">
        {view === "choose" && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl mb-4">Welcome! Choose an option:</h2>
            <div className="flex space-x-4">
              <Button onClick={() => setView("create")}>Create School</Button>
              <Button onClick={() => { setView("join"); loadSchools(); }}>Join School</Button>
            </div>
          </div>
        )}

        {view === "create" && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl mb-4">Create a New School</h2>
            <input
              className="border p-2 mb-4 rounded"
              placeholder="School Name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
            <Button onClick={handleCreate}>Create School</Button>
          </div>
        )}

        {view === "join" && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl mb-4">Join an Existing School</h2>
            <select
              className="border p-2 mb-4 rounded"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            >
              <option value="">Select a school</option>
              {availableSchools.map((school, idx) => (
                <option key={idx} value={school}>{school}</option>
              ))}
            </select>
            <Button onClick={handleJoin}>Join School</Button>
          </div>
        )}

        {view === "admin" && (
          <div>
            <h2 className="text-2xl mb-4">Admin Dashboard for {mySchool}</h2>
            <p>You are an admin. Promote teachers here.</p>
            <div>
              {lessonPlans.length === 0 ? (
                <p>No lesson plans available yet.</p>
              ) : (
                <div>
                  <h3 className="text-xl">Lesson Plans</h3>
                  <ul>
                    {lessonPlans.map((plan, idx) => (
                      <li key={idx}>
                        {plan.filename}
                        <Button onClick={() => promoteTeacher(plan.email)}>Promote to Admin</Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "teacher" && (
          <div>
            <h2 className="text-2xl mb-4">Teacher Dashboard for {mySchool}</h2>
            <p>You can view lesson plans from other teachers.</p>
            <div>
              {lessonPlans.length === 0 ? (
                <p>No lesson plans available yet.</p>
              ) : (
                <div>
                  <h3 className="text-xl">Lesson Plans</h3>
                  <ul>
                    {lessonPlans.map((plan, idx) => (
                      <li key={idx}>{plan.filename}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
            onLoginSuccess={() => {
              closeAllModals();
              window.location.reload();
            }}
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
