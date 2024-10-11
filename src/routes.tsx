import { paths } from '@/constants/paths';
import { BookListView, BooksSearchView } from '@/pages/books/views';
import { SignUpView } from '@/pages/sign-up/views';
import AuthGuard from '@/shared/guards/auth-guard';
import MainLayout from '@/shared/layout';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: '/dashboard',
        element: (
            <AuthGuard>
                <MainLayout>
                    <Outlet />
                </MainLayout>
            </AuthGuard>
        ),
        children: [
            {
                index: true,
                element: <BooksSearchView />,
            },
            {
                path: 'books',
                element: <BookListView />,
            },
        ],
    },
    {
        path: '/signup',
        element: <SignUpView />,
    },
    {
        path: '*',
        element: <Navigate to={paths.REDIRECT} />,
    },
]);

const Routes = () => {
    return <RouterProvider router={router} />;
};

export { Routes };
