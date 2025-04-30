import { Alert, Box, Button, Container, FormControl, FormLabel, Paper, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ApiHandler from "../../api/handler";

export default function RegisterUser() {
    const api = new ApiHandler();

    const [info, setInfo] = useState({});
    const [alertOn, setAlertOn] = useState({ show: false, message: "", severity: undefined });

    const handleRegister = async (e) => {
        let msg = ""

        if (!info.fullname) {
            msg = "Please input your full name.";
        }
        if (!info.email) {
            msg = "Email cannot be empty. Please input your emaill address.";
        }
        if (!info.pass) {
            msg = "Invalid password.";
        }

        if (msg) {
            setAlertOn({ message: msg, severity: 'warning', show: true });
            return;
        }

        await api.registerUser(info).then(resp => {
            if (resp.redirectTo) {
                location.href = resp.redirectTo
            } else {
                setAlertOn({ message: resp.message, severity: resp.status, show: true });
            }
        });

    }

    const handleChangeText = (type) => (e) => {
        let data = info;
        switch (type) {
            case 'fullname':
                data['fullname'] = e.currentTarget.value
                break;
            case 'email':
                data['email'] = e.currentTarget.value
                break;
            case 'passw':
                data['pass'] = e.currentTarget.value
                break;
            default:
                break;
        }
        setInfo(data);
    }

    useEffect(() => {

    }, [info]);

    return (
        <Container maxWidth={'xs'}>
            <Paper sx={{ p: 3, my: 15 }} elevation={1}>
                <Box>
                    {
                        alertOn.show ?
                            <Alert severity={alertOn.severity}>{alertOn.message}</Alert> :
                            <></>
                    }
                    <Stack direction={'column'} spacing={2} sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <FormLabel>Full Name</FormLabel>
                            <TextField
                                type="text"
                                fullWidth
                                placeholder={"Juan Dela Cruz"}
                                onChange={handleChangeText('fullname')}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <FormLabel>Email Address</FormLabel>
                            <TextField
                                type="email"
                                fullWidth
                                placeholder={"emailid@domain.com"}
                                onChange={handleChangeText('email')}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <FormLabel>Password</FormLabel>
                            <TextField
                                type="password"
                                fullWidth
                                onChange={handleChangeText('passw')}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <Button variant="contained" fullWidth onClick={handleRegister}>Login</Button>
                        </FormControl>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}

const divSection = document.getElementById('register-user-index');
if (divSection) {
    const csrfToken = divSection.getAttribute('data-crsftoken');
    const root = createRoot(divSection);
    root.render(<RegisterUser tokenCsrf={csrfToken} />);
}