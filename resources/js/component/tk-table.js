import { AttachFile } from "@mui/icons-material";
import { Alert, Box, Button, ButtonGroup, CircularProgress, IconButton, MenuItem, Paper, Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ApiHandler from "../api/handler";

export default function TableList(prop) {
    const { header, data, setReload, limit, setLimit, page, setPage, cntPage } = prop;

    const [limitPerPage, setLimitPerPage] = useState(limit);
    const [activeBtn, setActiveBtn] = useState('next');
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState({ show: false, message: null, severity: undefined });
    const [btnPage, setBtnPage] = useState({ prev: false, next: true });

    const handlePageDisplay = (e) => {
        setLimitPerPage(e.target.value);
        setLimit(e.target.value);
    }

    const handlePagination = (nav) => (e) => {
        let _page = page;
        if (nav < 0) {
            prop.setPage(_page - 1);
        } else {
            prop.setPage(_page + 1);
        }

    }

    useEffect(() => {
        if (header !== undefined || !header) {
            setLoading(false);
        }
    }, [header, data]);

    const handleClose = () => {
        setShowAlert({ ...showAlert, show: false });
    }

    useEffect(() => {
        setReload(showAlert.show);
    }, [showAlert]);

    useEffect(() => {
        if (page == 0) {
            setBtnPage({ prev: false, next: true });
        } else {
            if (data.length < limit) {
                setBtnPage({ next: false, prev: true });
            } else {
                setBtnPage({ next: true, prev: true });
            }

        }
    }, [page, data]);

    return (
        <Box>
            <Snackbar onClose={handleClose} open={showAlert.show} autoHideDuration={800} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity={showAlert.severity}>{showAlert.message}</Alert>
            </Snackbar>
            {loading ? <Paper sx={{ minHeight: 100 }}>
                <Box display={'flex'} justifyContent={'center'} alignContent={'center'}>
                    <CircularProgress sx={{ marginY: '40px' }} />
                </Box>
            </Paper> :
                <TableContainer component={Paper}>
                    {
                        header === undefined ?
                            <></> :
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {
                                            header.map((item, i) => {
                                                return <TableCell key={`header-item-${i}`} align={item.key === 'f_action' ? 'right' : 'left'}>{item.label}</TableCell>
                                            })
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row, i) => {
                                        return (
                                            <TableRow
                                                key={`item-row-${i}`}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TaskRow header={header} data={row} num={i} showAlert={setShowAlert} />
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>

                    }
                </TableContainer>
            }

            <Box sx={{ my: 2 }}>
                <Stack direction={"row"} justifyContent={'space-between'}>
                    <Box>
                        <Select
                            size="small"
                            value={limitPerPage}
                            onChange={handlePageDisplay}
                        >
                            <MenuItem value={10}>10 Per Page</MenuItem>
                            <MenuItem value={20}>20 Per Page</MenuItem>
                            <MenuItem value={50}>50 Per Page</MenuItem>
                        </Select>
                    </Box>
                    <Box>
                        <ButtonGroup
                            size="small"
                        >
                            <Button variant="outlined" disabled={btnPage.prev === false} onClick={handlePagination(-1)}>Prev</Button>
                            <Button variant="outlined" disabled={btnPage.next === false} onClick={handlePagination(1)}>Next</Button>
                        </ButtonGroup>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

const TaskRow = (prop) => {
    const { header, data, num, showAlert } = prop;

    const handleOpenImage = (path) => (e) => {
        window.open(process.env.MIX_APP_URL + '/' + path);
    }

    return header === undefined ?
        <></> :
        header.map((e, eKey) => {
            switch (e.key) {
                case 'f_num':
                    return <TableCell key={`item-data-${eKey}`}>{num + 1}</TableCell>
                case 'status':
                    return <TableCell key={`item-data-${eKey}`}><ToggleStatus value={data['status']} id={data['id']} showAlert={showAlert} /></TableCell>
                case 'f_action':
                    return <TableCell key={`item-data-${eKey}`} align="right">
                        {
                            data['task_attachment'] === null ?
                                <></> :
                                <IconButton size="small" sx={{ fontSize: '11pt' }} onClick={handleOpenImage(data.task_attachment.path)}>
                                    <AttachFile sx={{ fontSize: '11pt' }} />
                                </IconButton>
                        }
                        &nbsp;&nbsp;
                        <TogglePublished value={data['is_published_stat']} id={data['id']} showAlert={showAlert} /></TableCell>
                default:
                    return <TableCell key={`item-data-${eKey}`}>{data[e.key]}</TableCell>
            }
        });
}

const ToggleStatus = (prop) => {
    const api = new ApiHandler();
    const { value, showAlert, id } = prop;
    const [status, setStatus] = useState('todo');

    const handleChangeStatus = async (e, stat) => {
        let statVal;
        switch (stat) {
            case 'done':
                statVal = 1;
                break;
            case 'in_progress':
                statVal = 2;
                break;
            default:
                statVal = 0;
                break;
        }

        setStatus(stat);

        await api.updateTaskStatus(id, statVal).then(e => {
            if (e.message) {
                showAlert({ show: true, message: 'Updated Successfully', severity: 'success' });
            }
        }).catch(e => {
            showAlert({ show: true, message: e.message, severity: 'error' });
        });
    }

    useEffect(() => {
        if (value !== undefined) {
            switch (value) {
                case 1:
                    setStatus('done');
                    break;
                case 2:
                    setStatus('in_progress')
                    break;
                default:
                    setStatus('todo');
                    break;
            }
        }
    }, [value]);

    return <ToggleButtonGroup
        value={status}
        exclusive
        onChange={handleChangeStatus}
        size="small"
        color="primary"
    >
        <ToggleButton value="todo">
            <Typography sx={{ fontSize: '8pt' }}>TODO</Typography>
        </ToggleButton>
        <ToggleButton value="in_progress">
            <Typography sx={{ fontSize: '8pt' }}>In-Progress</Typography>
        </ToggleButton>
        <ToggleButton value="done">
            <Typography sx={{ fontSize: '8pt' }}>Done</Typography>
        </ToggleButton>
    </ToggleButtonGroup>
}

const TogglePublished = (prop) => {
    const api = new ApiHandler();

    const { value, showAlert, id } = prop;
    const [published, setPublish] = useState('save_as_draft');

    const handleChangePublished = async (e, status) => {
        setPublish(status);
        let stat;
        switch (status) {
            case 'publish':
                stat = 1;
                break;
            default:
                stat = 0;
                break;
        }
        await api.updatePublished(id, stat).then(e => {
            if (e.message) {
                showAlert({ show: true, message: 'Updated Successfully', severity: 'success' });
            }
        })
    }

    useEffect(() => {
        if (value !== undefined) {
            if (value === 1)
                setPublish('publish');
            else
                setPublish('save_as_draft');
        }
    }, [value]);

    return <ToggleButtonGroup
        value={published}
        exclusive
        onChange={handleChangePublished}
        size="small"
        color="primary"

    >
        <ToggleButton value="publish" aria-label="Published">
            <Typography sx={{ fontSize: '8pt' }}>Published</Typography>
        </ToggleButton>
        <ToggleButton value="save_as_draft" aria-label="Save as Draft">
            <Typography sx={{ fontSize: '8pt' }}>Draft</Typography>
        </ToggleButton>
    </ToggleButtonGroup>
}