"use client";
import "../../globals.css";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase.config";

const Navbar = () => {
  const router = useRouter();
  const [Delete, setDelete] = useState(false);

  //check if the user email is on the server
  const checkEmail=()=>{
    if(localStorage.getItem("user_id")==null){
      router.push("/signup")
    }else{
      Swal.fire({
        title:"Your are account is created login first",
        text:"please login or logout to create a new account",
        icon:"error"
      })
    }
  }

  //Push the route and delete
  const handleRoute = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEvent = event.target.value;
    if (selectedEvent && selectedEvent !== 'delete') {
      router.push(selectedEvent);
    }
    if (selectedEvent == 'delete') {
      setDelete(true);
      if (Delete) {
        Swal.fire({
          title: "Are you sure?",
          text: "You will not be able to recover this data!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes,Delete it",
        }).then(async (result) => {
          if (result.isConfirmed) {
              const userId = localStorage.getItem("user_id");
              if (!userId) return
              try {
                //Deleteing the user from the db
              const ref = doc(db, "user", userId);
              await deleteDoc(ref);
              Swal.fire({
                icon: "success",
                title: "Account deleted",
                text: "Your account has been deleted successfully!",
              });
              localStorage.clear();
            }catch (e) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: "Please try again later."
              });
            }
        }});
    }}
  };

  return (
    <nav className="flex flex-row gap-5 bg-black pt-3 pb-6">
      {/* Heading */}
      <div className="flex content-center ml-2 font-bold mt-2">
        <h1 className="text-2xl text-white font-bold text-[40px]">
          Smart Routine Optimizer
        </h1>
      </div>
      {/* buttons like signup,login  */}
      <div className="flex gap-5 ml-auto leading-none  ">
          <button onClick={checkEmail} className="text-xl leading-none text-black rounded-lg border-2 px-2 py-2 content-center bg-white w-[98px] h-[50px]">
            <p className="text-[14px] font-bold">Signup</p>
          </button>
        <Link href="/login">
          <button className="text-xl leading-none text-black rounded-lg border-2 px-2 py-2 content-center bg-white w-[98px] h-[50px]">
            <p className="text-[14px] font-bold">Login</p>
          </button>
        </Link>
      </div>
      {/* Displaying the username */}
      <div className="flex flex-row">
        <select className="w-[100px] rounded-lg text-black pl-2 font-bold text-[14px] outline-none" onChange={handleRoute}>
          <option value="">Options</option>
          <option value="/setting">Update the Username or password</option>
          <option value="delete">Delete the User</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
