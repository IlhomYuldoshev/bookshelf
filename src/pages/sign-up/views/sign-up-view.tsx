import { auth_requests } from '@/api/requests';
import { paths } from '@/constants/paths';
import { auth_service } from '@/services/auth-service';
import { showToast } from '@/services/toast-service';
import { useAuthStore } from '@/stores';
import { LoadingButton } from '@mui/lab';
import { Box, Grid2 as Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';

const validationSchema = yup.object({
    email: yup
        .string()
        .typeError('Enter a valid email')
        .email('Enter a valid email')
        .required('Email is required'),
    key: yup.string().typeError('Enter your key').required('Key is required'),
    name: yup.string().typeError('Enter your name').required('Name is required'),
    secret: yup.string().typeError('Enter your secret').required('Secret is required'),
});

type Props = {};

const SignUpView = (props: Props) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { userData, getUserData } = useAuthStore();

    const formik = useFormik({
        initialValues: {
            email: '',
            name: '',
            key: '',
            secret: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await auth_requests.signUp({
                    email: values.email,
                    key: values.key,
                    name: values.name,
                    secret: values.secret,
                });
                auth_service.setCredentials(response.data.data.key, response.data.data.secret);
                await getUserData();
                navigateAfterSuccess();
            } catch (e) {
                console.log(e);
                showToast({
                    type: 'error',
                    message: e,
                });
            }
        },
    });

    console.log(formik.errors);

    const navigateAfterSuccess = () => {
        navigate(
            {
                pathname: searchParams.get('returnTo') || paths.home,
            },
            {
                replace: true,
            }
        );
    };

    useEffect(() => {
        if (!!userData) {
            navigateAfterSuccess();
        }
    }, [userData]);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: '100vh',
            }}
        >
            <Box
                component={'form'}
                onSubmit={formik.handleSubmit}
                sx={{
                    backgroundColor: '#fff',
                    p: 4,
                    borderRadius: '20px',
                    boxShadow: 4,
                    maxWidth: '600px',
                }}
            >
                <h1>Sign Up</h1>

                <Grid container spacing={3} mb={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="email"
                            value={formik.values.email}
                            name="email"
                            onChange={(event) => formik.handleChange(event)}
                            error={!!formik.errors.email}
                            helperText={formik.errors.email ? formik.errors.email : ''}
                            label={'Email'}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="text"
                            value={formik.values.name}
                            name="name"
                            onChange={(event) => formik.handleChange(event)}
                            error={!!formik.errors.name}
                            helperText={formik.errors.name ? formik.errors.name : ''}
                            label={'Name'}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="text"
                            value={formik.values.key}
                            name="key"
                            onChange={(event) => formik.handleChange(event)}
                            error={!!formik.errors.key}
                            helperText={formik.errors.key ? formik.errors.key : ''}
                            label={'Key'}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="password"
                            value={formik.values.secret}
                            name="secret"
                            onChange={(event) => formik.handleChange(event)}
                            error={!!formik.errors.secret}
                            helperText={formik.errors.secret ? formik.errors.secret : ''}
                            label={'Secret'}
                        />
                    </Grid>
                </Grid>

                <LoadingButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    loading={formik.isSubmitting}
                    type="submit"
                >
                    Sign up
                </LoadingButton>
            </Box>
        </Box>
    );
};

export default SignUpView;
