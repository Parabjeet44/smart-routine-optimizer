"use client"
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase.config";

const TaskLineChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        try {
          const taskQuery = collection(db, "user", userId, "task");
          const res = await getDocs(taskQuery);

          const taskData = res.docs.map((task, index) => ({
            name: `Task ${index + 1}`,
            time: task.data().elapsedTime, // Time spent on task
          }));

          setData(taskData);
        } catch (e) {
          console.error("Error fetching data: ", e);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="time" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TaskLineChart;
