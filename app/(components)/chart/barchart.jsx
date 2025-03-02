"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase.config";

const Barchart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        try {
          const taskQuery = collection(db, "user", userId, "task");
          const res = await getDocs(taskQuery);

          const chartData = res.docs.map((task) => ({
            name: task.data().title, // Get task title
            time: task.data().elapsedTime, // Get elapsed time in seconds
          }));

          setData(chartData);
        } catch (e) {
          console.error("Error fetching data: ", e);
        }
      }
    };

    fetchData();
  }, []); // Runs once when the component mounts

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="time" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Barchart;
