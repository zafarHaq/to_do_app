import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Grid, IconButton, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateNewTaskModal from "./CreateNewTaskModal";
import Login from "./Login";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const adminLoggedIn = localStorage.getItem("adminLoggedIn");
  const uid = localStorage.getItem("uid");
  const navigate = useNavigate();
  const [tasks, setTasks] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  React.useEffect(() => {
    if (!adminLoggedIn || adminLoggedIn === "false") {
      navigate("/login");
    }
    getTasksApi();
  }, []);
  const getTasksApi = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/user/get_all_tasks`,
        {
          uid: uid,
        }
      );
      setTasks(response.data.tasks ? response.data.tasks : []);
    } catch (e) {}
  };
  const deleteTaskApi = async (tid) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/user/delete_task`,
        {
          tid,
        }
      );
      getTasksApi();
    } catch (e) {}
  };
  return adminLoggedIn ? (
    <>
      {/* -----------app bar---------- */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              To Do
            </Typography>
            <Button
              color="inherit"
              onClick={() => {
                localStorage.setItem("adminLoggedIn", false);
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      {/* -----------app bar---------- */}

      {/* -----------tasks---------- */}
      <Grid container spacing={2} p={15}>
        <Grid item style={{ width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" component="div" sx={{}}>
                Welcome to your To-Do List!
              </Typography>
            </Box>
            <Box>
              <Button color="success" onClick={handleOpen}>
                Create New Task
              </Button>
            </Box>
          </Box>
        </Grid>

        {tasks.map((task, index) => {
          return (
            <Grid item style={{ width: "100%" }} key={index}>
              <Paper
                sx={{ display: "flex", justifyContent: "space-between", p: 3 }}
              >
                <Box>{task.title}</Box>
                <Box>
                  {task.priority}
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="edit"
                    component="span"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="delete"
                    component="span"
                    onClick={() => deleteTaskApi(task.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      {/* -----------tasks---------- */}

      <CreateNewTaskModal
        open={open}
        handleClose={handleClose}
        uid={uid}
        getTasksApi={getTasksApi}
      />
    </>
  ) : (
    <Login />
  );
}
