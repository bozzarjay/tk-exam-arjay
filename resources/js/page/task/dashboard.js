import { Box, Button, ButtonGroup, Chip, Container, Divider, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import TableList from "../../component/tk-table";
import FilterStatusToggleBtn from "../../component/tk-filterbtn";
import ApiHandler from "../../api/handler";

export default function Dashboard(prop) {
    const api = new ApiHandler();

    const [limitPerPage, setLimitPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [init, setInit] = useState(false);
    const [taskEntries, setTaskEntries] = useState({ header: [], data: [] });
    const [isReload, setReload] = useState(false);
    const [stat, setStat] = useState('all');
    const [totalPage, setTotalPage] = useState(0);
    const [textSearch, setTextSearch] = useState('');

    const refreshList = async () => {
        const taskHeader = [
            { key: 'f_num', label: 'No' },
            { key: 'title', label: 'Title' },
            { key: 'content', label: 'Content' },
            { key: 'status', label: 'Task Status' },
            { key: 'is_published', label: 'Published' },
            { key: 'f_action', label: 'Action' }
        ];

        await api.listTaskEntries(stat, limitPerPage, page, textSearch).then(data => {
            let items = data.data;
            let count = data.count;
            setTotalPage(count);

            if (items) {
                items = items.map(row => {
                    return {
                        ...row,
                        is_published_stat: row.is_published,
                        is_published: ChipPublished(row.is_published)
                    }
                });
            }

            setTaskEntries({ header: taskHeader, data: items });
        });
    }

    const ChipPublished = (status) => {
        switch (status) {
            case 1:
                return <Chip size="small" label="Published" color="primary" />
            default:
                return <Chip size="small" label="Draft" />
        }
    }

    const handleRedirectCreateTask = () => {
        location.href = "/task/create-new";
    }

    const handleUserLogout = () => {
        window.open('./user/logout', '_SELF');
    }

    useEffect(() => {
        if (init === false) {
            refreshList();
            setInit(true);
        }
    }, [init]);

    useEffect(() => {
        if (isReload === true) {
            refreshList();
        }
    }, [isReload]);

    useEffect(() => {
        refreshList();
    }, [stat, page, limitPerPage, textSearch]);

    const handleSearchTitle = async (e) => {
        setTextSearch(e.currentTarget.value);
    }

    return (
        <Container maxWidth='lg' sx={{ my: 10 }}>
            <Button onClick={handleUserLogout}>Logout</Button>
            <Typography variant="h4">Task Manager</Typography>
            <Typography variant="subtitle1">List all registered task.</Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ my: 2 }}>
                <Stack direction={"row"} justifyContent={'space-between'}>
                    <Box>
                        <TextField size="small" onChange={handleSearchTitle} />&nbsp;
                        <Button size="small" onClick={handleRedirectCreateTask}>Create New Task</Button>
                    </Box>
                    <Box>
                        <FilterStatusToggleBtn setStatus={setStat} status={stat} />
                    </Box>
                </Stack>
            </Box>
            <TableList
                header={taskEntries.header}
                data={taskEntries.data}
                setReload={setReload}
                limit={limitPerPage}
                setLimit={setLimitPerPage}
                page={page}
                setPage={setPage}
                cntPage={totalPage}
            />
        </Container>
    );
}

const divElement = document.getElementById('dashboard-index');
if (divElement) {
    localStorage.setItem('token', divElement.getAttribute('token'));
    const root = createRoot(divElement);
    root.render(<Dashboard />);
}