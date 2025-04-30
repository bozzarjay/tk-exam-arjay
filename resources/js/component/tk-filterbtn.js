import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useState } from "react";

export default function FilterStatusToggleBtn(prop) {
    const { setStatus, status } = prop
    const [activeBtn, setActiveBtn] = useState(status);

    const handleFilterTable = (e, active) => {
        setActiveBtn(active);
        setStatus(active);
    }

    return (
        <ToggleButtonGroup
            value={activeBtn}
            exclusive
            onChange={handleFilterTable}
            size="small"
            color="primary"
        >
            <ToggleButton value="all" aria-label="All">
                <Typography variant="caption">All</Typography>
            </ToggleButton>
            <ToggleButton value="done" aria-label="Done">
                <Typography variant="caption">Done</Typography>
            </ToggleButton>
            <ToggleButton value="in_progress" aria-label="In-Progress">
                <Typography variant="caption">In-Progress</Typography>
            </ToggleButton>
            <ToggleButton value="todo" aria-label="TODO">
                <Typography variant="caption">TODO</Typography>
            </ToggleButton>
        </ToggleButtonGroup>
    );
}