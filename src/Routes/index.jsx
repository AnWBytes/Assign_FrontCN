import React from "react";
import { Route, Routes } from "react-router-dom";
import TodoList from "../pages/todo-list";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<TodoList />} />
      {/* <Route path={"/about"} element={<About />} /> */}
      {/* <Route path={"/shop"} element={<Shop />} /> */}
    </Routes>
  );
};

export default AppRoutes;
