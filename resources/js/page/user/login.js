import { Alert, Box, Button, Container, FormControl, FormLabel, Paper, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ApiHandler from "../../api/handler";

export default function Login(prop) {
    const { tokenCsrf, message } = prop;

    const api = new ApiHandler();
    const [emailuser, setEmailUser] = useState("");
    const [passUser, setPassUser] = useState("");
    const [alertOn, setAlertOn] = useState({ show: false, message: "", severity: undefined });

    const handleLogin = async (e) => {

        if (!emailuser || !passUser) {
            setAlertOn({ message: "Username or Password cannot be empty.", severity: 'warning', show: true });
            return;
        }

        const frm = document.getElementById('login-form');
        frm.submit();
    }

    const handleChangeText = (type) => (e) => {
        switch (type) {
            case 'email':
                setEmailUser(e.currentTarget.value);
                break;
            case 'pass':
                setPassUser(e.currentTarget.value);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (message)
            setAlertOn({ message: message, severity: 'warning', show: true })
        
    }, [message]);

    return (
        <Container maxWidth={'xs'}>
            <Paper sx={{ p: 3, my: 15 }} elevation={1}>
                <Box>
                    {
                        alertOn.show ?
                            <Alert severity={alertOn.severity}>{alertOn.message}</Alert> :
                            <></>
                    }
                    <form method="POST" action="/user/auth" id="login-form">
                        <input type="hidden" name="_token" value={tokenCsrf} />
                        <Stack direction={'column'} spacing={2} sx={{ mt: 2 }}>
                            <FormControl fullWidth>
                                <FormLabel>Email Address</FormLabel>
                                <TextField
                                    name="username"
                                    type="email"
                                    fullWidth
                                    placeholder={"emailid@domain.com"}
                                    onChange={handleChangeText('email')}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <FormLabel>Password</FormLabel>
                                <TextField
                                    name="passw"
                                    type="password"
                                    fullWidth
                                    onChange={handleChangeText('pass')}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <Button variant="contained" fullWidth onClick={handleLogin}>Login</Button>
                            </FormControl>
                        </Stack>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
}

const divSection = document.getElementById('login-index');
if (divSection) {
    const csrfToken = divSection.getAttribute('data-crsftoken');
    const msg = divSection.getAttribute('data-message');
    const root = createRoot(divSection);
    root.render(<Login tokenCsrf={csrfToken} message={msg} />);
}