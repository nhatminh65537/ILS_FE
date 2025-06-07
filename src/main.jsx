import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { PrivateRoute, PublicRoute } from "./components/RouteGuards";
import Learn from "./pages/Learn/Learn.jsx";
import LearnEdit from "./pages/Learn/Edit/LearnEdit.jsx";
import LessonView from "./pages/Learn/Lesson/LessonView.jsx";
import ModuleView from "./pages/Learn/Module/ModuleView.jsx";
import { initializeUserData } from "./store/myUserSlice";
import { useLayoutEffect } from "react";
import Profile from "./pages/Profile/Profile.jsx";
import ChallengesPage from "./pages/Challenges/ChallengesPage.jsx";
import ScoreboardPage from "./pages/Scoreboard/ScoreboardPage.jsx";
import Home from "./pages/Home/Home.jsx";
import PermissionManagement from "./pages/PermissionManagement/PermissionManagement.jsx";

// Wrapper component to initialize user data if authenticated
const AppWithAuth = () => {

    // Get token

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    
    // if (isAuthenticated) {
    //     dispatch(initializeUserData());
    // }

    useEffect(() => {
        // If user is already authenticated (e.g., page refresh with valid token)
        // load user data
        if (isAuthenticated) {
            dispatch(initializeUserData());
        }
    }, [dispatch, isAuthenticated]);
    
    return (
        <BrowserRouter>
            <Routes>
                {/* Standalone routes with custom layouts (no footer) */}
                <Route element={<PrivateRoute />}>
                    <Route path="learn/edit/:moduleId" element={<LearnEdit />} />
                    <Route path="learn/:moduleId/lessons/:lessonId" element={<LessonView />} />
                    
                </Route>
                
                {/* Standard App Layout Routes */}
                <Route path="/" element={<App />}>
                    {/* Public routes (redirect to home if already authenticated) */}
                    <Route element={<PublicRoute />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                    </Route>

                    {/* Home page - accessible to all */}
                    <Route index element={<Home />} />

                    {/* Protected routes (redirect to login if not authenticated) */}
                    <Route element={<PrivateRoute />}>
                        <Route
                            path="learn"
                            element={<Learn />}
                        />
                        <Route
                            path="challenge/*"
                            element={<ChallengesPage />}
                        />
                        <Route
                            path="scoreboard"
                            element={<ScoreboardPage />}
                        />
                        <Route
                            path="profile"
                            element={<Profile />}
                        />
                        <Route
                            path="learn/:moduleId"
                            element={<ModuleView />}
                        />
                        <Route
                            path="/permissions"
                            element={<PermissionManagement />}
                        />
                    </Route>

                    {/* 404 route */}
                    <Route path="*" element={<div>Page Not Found</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

// Create root and render app
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <Provider store={store}>
            <AppWithAuth />
        </Provider>
    </StrictMode>
);
