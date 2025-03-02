"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { db } from "@/app/lib/firebase.config";
import { updateDoc, doc, query, where, collection } from "firebase/firestore";
import Swal from "sweetalert2";
const Setting = () => {
  const [updateUsername, setUpdateUsername] = useState('');
  const [updatePassword, setUpdatePassword] = useState('');

  const handleUpdateUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateUsername(event.target.value)
  }

  const handleUpdatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatePassword(event.target.value)
  }

  const handleUsernameChange = async (event: React.FormEvent<HTMLFormElement>) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return
    try {
      const ref = doc(db, "user", userId);
      const res = await updateDoc(ref, { username: updateUsername });
      Swal.fire({
        title: "Success",
        text: "Your username was successfully updated",
        icon: "success"
      })
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Failed to update your username",
        icon: "error"
      })
    }
  }

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return
    try {
      const ref = doc(db, "user", userId);
      const res = await updateDoc(ref, { password: updatePassword});
      Swal.fire({
        title: "Success",
        text: "Your password was successfully updated",
        icon: "success"
      })
    } catch (error) {
      Swal.fire({
        title: "Failed",
        text: "Failed to update your password",
        icon: "error"
      })
    }
  }

  return (
    <div className="flex flex-col mx-auto mt-[130px] text-center space-y-11">
      <h1 className="w-[572px] h-[32px] text-[32px] font-bold text-black mx-auto">
        Update the username or password
      </h1>
      <form onSubmit={handleUsernameChange} className="mx-auto flex flex-col gap-3 text-center ">
        <p className="text-[24px] font-semibold">Update the username</p>
        <input type="text" placeholder="Enter new username..." onChange={handleUpdateUsername} className="border-2 border-black rounded-[20px] w-[324px] h-[40px] outline-none pl-3" />
        <input type="submit" value="Update Username" className="w-[174px] h-[46px] rounded-[6px] bg-black text-white mx-auto" />
      </form>
      <form onSubmit={handlePasswordChange} className="mx-auto flex flex-col gap-3 text-center ">
        <p className="text-[24px] font-semibold">Update the password</p>
        <input type="password" placeholder="Enter new password..." onChange={handleUpdatePassword} className="border-2 border-black rounded-[20px] w-[324px] h-[40px] outline-none pl-3" />
        <input type="submit" value="Update Password" className="w-[174px] h-[46px] rounded-[6px] bg-black text-white mx-auto" />
      </form>
      <Link href='/'><button className="w-[174px] h-[46px] rounded-[6px] bg-black text-purple-500 mx-auto">Go back to homepage</button></Link>
    </div>
  );
};

export default Setting;
