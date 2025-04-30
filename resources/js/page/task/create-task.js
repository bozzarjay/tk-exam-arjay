import { Alert, Box, Button, Container, FormControl, FormLabel, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import ApiHandler from "../../api/handler";


export default function CreateTask(prop) {
    const api = new ApiHandler();

    const [info, setInfo] = useState({ isPublish: 0 });
    const [alertOn, setAlertOn] = useState({ show: false, message: "", severity: undefined });

    const handleChangeText = (type) => (e) => {
        let data = info;
        data[type] = e.currentTarget.value;
        setInfo(data);
    }

    const handleFileChange = (e) => {
        const attached = e.target.files[0];
        if (attached) setInfo({ ...info, fileName: attached.name, fileAttached: attached });
    }

    const handleTaskCreate = async () => {
        await api.createTaskEntries(info).then(data => {
            if (data.message === 'SUCCESS') {
                setAlertOn({ message: 'Task is successfully saved', severity: 'success', show: true });
                setTimeout(() => {
                    const isReload = confirm("Page will restart.");
                    if(isReload){
                        location.reload();
                    }
                }, 600);
            }
        }).catch(e => {
            // console.log(e);
            // let e = dataResp.response
            // let data = { message: e.data.fail }
            // if (e.status === 500) {
            //     return { ...data, status: 'error' }
            // } else {
            //     return { ...data, status: 'warning' }
            // }
            // setAlertOn({ message: e.message, severity: e.status, show: true });
        });
    }

    const handleSaveType = (e, type) => {
        setInfo({
            ...info,
            isPublish: type === 'save_as_draft' ? 0 : 1
        })
    }

    const handleTaskList = () => {
        location.href = "../";
    }

    useEffect(() => {
        console.log(info);
    }, [info]);

    return (
        <Container maxWidth={'md'}>
            <Paper sx={{ p: 3, my: 5 }} elevation={1}>
                <Box>
                    {
                        alertOn.show ?
                            <Alert severity={alertOn.severity}>{alertOn.message}</Alert> :
                            <></>
                    }
                    <Stack direction={'column'} spacing={2} sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <FormLabel>Task</FormLabel>
                            <TextField
                                type="text"
                                fullWidth
                                placeholder={"Type your preferred Task Title"}
                                onChange={handleChangeText('title')}
                                value={info.title}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <FormLabel>Content</FormLabel>
                            <TextField
                                type="text"
                                fullWidth
                                placeholder={"Content"}
                                onChange={handleChangeText('content')}
                                multiline
                                rows={10}
                                value={info.content}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <FormLabel>&nbsp;</FormLabel>
                            <input
                                style={{ padding: '15px', border: '1px dashed #d3d3d3' }}
                                type="file"
                                onChange={handleFileChange}
                                name="file_attached"
                                accept="image/*"
                            />
                        </FormControl>
                        <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
                            <Box>
                                <ToggleButtonGroup
                                    value={info.isPublish === 0 ? 'save_as_draft' : 'published'}
                                    exclusive
                                    onChange={handleSaveType}
                                    size="small"
                                    color="primary"
                                >
                                    <ToggleButton value="save_as_draft">
                                        <Typography variant="caption">Save as Draft</Typography>
                                    </ToggleButton>
                                    <ToggleButton value="published">
                                        <Typography variant="caption">Publish</Typography>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                            <Box>
                                <Button variant="text" sx={{ m: 1 }} onClick={handleTaskList}>Back to Task List</Button>
                                <Button variant="contained" sx={{ m: 1 }} onClick={handleTaskCreate}>Create New</Button>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}

const divElement = document.getElementById('task-create-index');
if (divElement) {
    const root = createRoot(divElement);
    const token = divElement.getAttribute('data-crsftoken');
    root.render(<CreateTask token={token} />);
}