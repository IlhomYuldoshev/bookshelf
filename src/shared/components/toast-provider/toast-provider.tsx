import React from 'react';
import { ToastContainer } from 'react-toastify';

type Props = {};

const ToastProvider = (props: Props) => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
};

export default ToastProvider;
