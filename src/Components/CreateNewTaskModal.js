import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Chip,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CreateNewTaskModal({
  open,
  handleClose,
  uid,
  getTasksApi,
}) {
  const [priority, setPriority] = React.useState("high");
  const [label, setLabel] = React.useState("");
  const [labelChips, setLabelChips] = React.useState([]);
  const handleChange = (event, newPriority) => {
    setPriority(newPriority);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/user/create_new_task`,
        {
          title: data.get("title"),
          priority: priority,
          uid: uid,
        }
      );
      handleClose();
      getTasksApi();
    } catch (e) {}
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create New Task
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="title"
              name="title"
              autoComplete="title"
              type="text"
              autoFocus
            />
            <ToggleButtonGroup
              color="primary"
              value={priority}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value="high">High</ToggleButton>
              <ToggleButton value="Medium">Medium</ToggleButton>
              <ToggleButton value="Low">Low</ToggleButton>
            </ToggleButtonGroup>
            <TextField
              margin="normal"
              required
              id="label"
              label="add label"
              name="label"
              autoComplete="label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2, ml: 2 }}
              onClick={() => {
                let labelChipNew = label;
                let labelChipsDup = labelChips;
                labelChipsDup.push(labelChipNew);
                setLabelChips(labelChipsDup);
              }}
            >
              Add
            </Button>
            <Stack direction="row" spacing={1}>
              {labelChips.map((label, index) => {
                return <Chip key={index} label={label} />;
              })}
            </Stack>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
