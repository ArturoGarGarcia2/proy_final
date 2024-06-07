import { RouterProvider, createBrowserRouter } from "react-router-dom"
import RootLayout from "./pages/RootLayout"
import ProjectPage from "./pages/ProjectPage"
import MainPage from "./pages/MainPage"
import ErrorElement from "./components/ErrorElement"
import ContextProvider from "./context/ContextProvider"
import ProtectedRoute from "./utils/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import NewProjectPage from "./pages/NewProjectPage"
import ProjectsPage from "./pages/ProjectsPage"
import NewBudgetPage from "./pages/NewBudgetPage"
import BudgetPage from "./pages/BudgetPage"
import AdminPage from "./pages/AdminPage"
import MeetingsPage from "./pages/MeetingsPage"

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <RootLayout />,
            errorElement: <ErrorElement />,
            children: [
                {
                    element: <ProtectedRoute logged={true} redirectPath='/login' />,
                    children: [
                        { index: true, element: <MainPage /> },
                        { path: '/project/:projectId', element: <ProjectPage />,},
                        { path: '/projects', element: <ProjectsPage />,},
                        { path: '/budget/:budgetId', element: <BudgetPage />,},
                        { path: '/newProject', element: <NewProjectPage /> },
                        { path: '/newBudget/:projectId', element: <NewBudgetPage /> },
                        { path: '/meetings', element: <MeetingsPage /> },
                        { path: '/admin', element: <AdminPage /> },
                    ]
                },
            ]
        },
        {
            path: "/login",
            element: <LoginPage />,
        },
    ])
    return (
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    )
}

export default App
