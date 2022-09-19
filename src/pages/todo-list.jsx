import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Container,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Navbar,
  NavbarBrand,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Alert,
} from "reactstrap";
import axios from "axios";

const TodoList = () => {
  const [modal, setModal] = useState(false);
  const [unmountOnClose, setUnmountOnClose] = useState(true);
  const [Lists, setList] = useState([]);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("add");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadList();
  }, []);

  const resetvariables = () => {
    setTask("");
    setDescription("");
    setId("");
    setType("add");
    setMessage('');
  }

  const loadList = async () => {
    const result = await axios.get(
      "http://localhost:8888/todo-app/public/api/task-list"
    );
    console.log(result.data.data);
    setList(result.data.data);
  };

  const toggle = () =>{
    setModal(!modal);
    resetvariables();
  } 
  const changeUnmountOnClose = (e) => {
    let { value } = e.target;
    setUnmountOnClose(JSON.parse(value));
  };

  const handleTaskName = (e) => {
    console.log("====>", e.target.value);
    setTask(e.target.value);
  };

  const handleTaskDescription = (e) => {
    console.log("====>", e.target.value);
    setDescription(e.target.value);
  };

  let formData = new FormData();
  formData.set("name", task);
  formData.set("description", description);

  const submitData = async (e) => {
    e.preventDefault();
    if (type == "edit") {
      const reqData = {
        name: task,
        description: description,
      };
      console.log("====>22222222", formData.name);
      const url = "http://localhost:8888/todo-app/public/api/task-update/" + id;
      const result = await axios.put(url, reqData);
      setList(result.data.data);
      setModal(!modal);
      setTask("");
      setDescription("");
    } else {
      console.log("====>");
      const url = "http://localhost:8888/todo-app/public/api/task-create";
      const result = await axios.post(url, formData);
      setList(result.data.data);
      setModal(!modal);
      setTask("");
      setDescription("");
    }
  };

  const changeTaskData = async (e) => {
    setModal(!modal);
    console.log("--==>", e.currentTarget.getAttribute("data-id"));
    console.log(e.currentTarget.id);
    if (e.currentTarget.getAttribute("data-id") == "edit") {
      setType(e.currentTarget.getAttribute("data-id"));
      setId(e.currentTarget.id);
      const url =
        "http://localhost:8888/todo-app/public/api/task-detail/" +
        e.currentTarget.id;
      const result = await axios.get(url);
      //  console.log("===------=====-----===>", result.data.data);
      setTask(result.data.data.name);
      setDescription(result.data.data.detail);
    }
  };

  const markAsCompleted = async (e) => {
    console.log("--==>", e.currentTarget.getAttribute("data-id"));
    setId(e.currentTarget.getAttribute("data-id"));

    const reqData = { is_completed: 1 };
    const url =
      "http://localhost:8888/todo-app/public/api/task-complete/" +
      e.currentTarget.getAttribute("data-id");
    const result = await axios.patch(url, reqData);
    setList(result.data.data);
  };

  const deleteTask = async (e) => {
    console.log("--==>", e.currentTarget.getAttribute("data-id"));
    setId(e.currentTarget.getAttribute("data-id"));

    const url =
      "http://localhost:8888/todo-app/public/api/task-remove/" +
      e.currentTarget.getAttribute("data-id");
    const result = await axios.delete(url);
    if (result.data.success == false) {
      setMessage(result.data.message);
    } else {
      setList(result.data.data);
    }
  };

  return (
    <div className="container-fluid">
      <Navbar className="my-2" color="dark" dark>
        <NavbarBrand href="/">Todo List</NavbarBrand>
        <Button color="primary" onClick={toggle}>
          + Add Task
        </Button>
      </Navbar>
      <Container className="bg-light border" fluid="lg">
        {message !== "" ? <Alert color="danger">{message}</Alert> : ""}
        <ListGroup>
          {Lists.map((list, index) => (
            <div className="row" key={index}>
              <div className="col-md-8">
                <ListGroupItem key={index}>
                  <ListGroupItemHeading>{list.name}</ListGroupItemHeading>
                  <ListGroupItemText>{list.detail}</ListGroupItemText>
                </ListGroupItem>
              </div>

              <div className="col-md-4" key={index}>
                {list.is_completed == 1 ? (
                  <Button color="success">
                    <i className="fa fa-check" style={{ color: "white" }}></i>
                    <span style={{ color: "white" }}> Done</span>
                  </Button>
                ) : (
                  <Button
                    color="info"
                    data-id={list.id}
                    onClick={markAsCompleted}
                  >
                    <span style={{ color: "white" }}>Mark Done</span>
                  </Button>
                )}

                <Button
                  color="warning"
                  className="m-1"
                  id={list.id}
                  data-id="edit"
                  onClick={changeTaskData}
                >
                  <i className="fa fa-pencil-square-o"></i>
                </Button>
                <Button
                  color="danger"
                  className="m-1"
                  data-id={list.id}
                  onClick={deleteTask}
                >
                  <i className="fa fa-trash"></i>
                </Button>
              </div>
            </div>
          ))}
        </ListGroup>
      </Container>

      <Modal isOpen={modal} toggle={toggle} unmountOnClose={unmountOnClose}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            name="name"
            placeholder="Enter task title"
            value={task}
            onChange={handleTaskName}
          />
          <Input
            type="textarea"
            placeholder="Task description"
            rows={4}
            className="m-2"
            value={description}
            onChange={handleTaskDescription}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={submitData}>
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TodoList;
