"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { auth, provider,db } from "@/app/lib/firebase.config";
import Swal from "sweetalert2";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email !== '' && password !== '') {
      const Query = query(collection(db, "user"), where("email", "==", email), where("password", "==", password));
      const data = await getDocs(Query);
      if (!data.empty) {
        try{
          const user = data.docs[0].id;
          localStorage.setItem("user_id", user);
          Swal.fire({
            title: "Login Succuess",
            text: "Login was Successful",
            icon: "success"
          })
          router.push('/');
        }catch (e) {
          Swal.fire({
            title: "Login Failed",
            text: "Incorrect email or password",
            icon: "error"
          })
          setEmail('');
          setPassword('');
        }
      }
    }
  }

  const handleGoogleSignUp = async (event: any) => {
    const result = await signInWithPopup(auth, provider);
    Swal.fire({
      title: "Successfully signed in",
      text: "Welcome to the smart routine optimzer",
      icon: "success"
    });
    router.push("/");
    return result;
  }
  return (
    <div className="mt-[100px] text-center flex flex-col my-auto">
      <h1 className="font-bold w-[98px] h-[27px] text-[32px] mx-auto mb-5">Login</h1>
      <form onSubmit={handleSubmission} className="w-[404px] h-[350px] rounded-[16px] border-2 bg-white mx-auto flex flex-col">
        <div className="space-y-4 h-[200px] pt-[40px]">
          <div className="w-full h-[64px]">
            <p className="font-bold">Email</p>
            <input
              type="email"
              name="email"
              placeholder="Enter your email..."
              onChange={handleEmail}
              required
              className="w-[324px] h-[40px] pl-3 border-2 border-black rounded-[24px]"
            />
          </div>
          <div>
            <p className="font-bold">Password</p>
            <input
              type="password"
              name="password"
              placeholder="Enter your password..."
              onChange={handlePassword}
              required
              className="w-[324px] h-[40px] pl-3 border-2 border-black rounded-[24px]"
            />
          </div>
        </div>

        <input
          type="submit"
          value="Login"
          className="border-2 w-[324px] h-[48px] rounded-[24px] bg-black text-white mx-auto"
        />
        <p className="text-lg">
          Don't have an account? Sign up{" "}
          <a className="text-green-500" href="./signup">
            here
          </a>
          .
        </p>
        <button onClick={handleGoogleSignUp} className="border-2 w-[324px] h-[48px] rounded-[24px] bg-black text-white mx-auto flex items-center justify-center gap-2">
          <i className="fa-brands fa-google"></i> Continue with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
