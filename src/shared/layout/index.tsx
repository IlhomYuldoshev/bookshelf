import { paths } from '@/constants/paths';
import { auth_service } from '@/services/auth-service';
import { RouterLink } from '@/shared/components/router-link';
import { Box, ListItemButton, Stack } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
};

const MainLayout = (props: Props) => {
    const location = useLocation();

    const menu = [
        {
            label: 'Search books',
            href: paths.home,
        },
        {
            label: 'My Books',
            href: paths.books,
        },
    ];

    const logout = () => {
        auth_service.clearCredentials();
        window.location.reload();
    };

    return (
        <Box>
            <Stack direction={'row'}>
                <Box
                    sx={{
                        width: '300px',
                        height: '100vh',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                    }}
                >
                    {menu.map((item) => {
                        return (
                            <ListItemButton
                                sx={{
                                    padding: '25px',
                                    fontSize: '16px',
                                    textDecoration: 'none',
                                    color: (theme) =>
                                        location.pathname === item.href ? '#fff' : '#222',
                                    backgroundColor: (theme) =>
                                        location.pathname === item.href
                                            ? `${theme.palette.primary.main} !important`
                                            : theme.palette.grey[300],
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.palette.grey[500],
                                    },
                                }}
                                href={item.href}
                                LinkComponent={RouterLink}
                                key={item.href}
                            >
                                {item.label}
                            </ListItemButton>
                        );
                    })}
                    <ListItemButton
                        onClick={logout}
                        sx={{
                            padding: '25px',
                            fontSize: '16px',
                            textDecoration: 'none',
                            color: '#222',
                            backgroundColor: (theme) => theme.palette.grey[300],
                            '&:hover': {
                                backgroundColor: (theme) => theme.palette.grey[500],
                            },
                        }}
                    >
                        Logout
                    </ListItemButton>
                </Box>
                <Box width={1}>{props.children}</Box>
            </Stack>
        </Box>
    );
};

export default MainLayout;
