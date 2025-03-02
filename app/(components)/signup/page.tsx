  "use client";
  import React, { useState } from "react";
  import { signInWithPopup } from "firebase/auth";
  import { auth, provider, db } from "../../lib/firebase.config"
  import { useRouter } from "next/navigation";
  import { collection, addDoc, getDocs, where, query } from "firebase/firestore";
  import Swal from "sweetalert2";

  const Signup = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    }

    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
      const user = event.target.value;
      setEmail(user);
    }

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
      const user = event.target.value;
      setPassword(user);
    }

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const Query = query(collection(db, "user"), where("email", "==", email));
      const res = await getDocs(Query);
      if (!res.empty) {
        Swal.fire({
          title: "Email already exists!",
          text: "Please use a different email address.",
          icon: "error",
        });
        return;
      } else {
        const user = await addDoc(collection(db, "user"), { username, email, password });
        console.log(user.id)
        Swal.fire({
          title: "Signup Successful!",
          text: "Welcome to Smart Routine Optimizer!",
          icon: "success",
        })
      }

    }

    const handleGoogleSignup = async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("Signed in user:", result.user.displayName);
        Swal.fire({
          title: "Sign in was successful",
          text: "Welcome to Smart Routine Optimizer!",
          icon: "success"
        })
        router.push('/');
      } catch (error) {
        console.error("Google Signup Error:", error);
      }
    };

    return (
      <div className="mt-[100px] text-center flex flex-col my-auto">
        <h1 className="font-bold w-[130px] h-[48px] text-[32px] mx-auto">Signup</h1>

        <form onSubmit={handleSignup} className="w-[404px] h-[450px] rounded-[16px] border-2 bg-white mx-auto flex flex-col">
          <div className="space-y-4 h-[300px] pt-[40px]">
            <div className="w-full h-[64px]">
              <p className="font-bold left-8">Username</p>
              <input
                type="text"
                name="username"
                placeholder="Enter your username..."
                onChange={handleUserName}
                required
                className="w-[324px] h-[40px] pl-3 border-2 border-black rounded-[24px]"
              />
            </div>
            <div>
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

          <input type="submit" value="Signup" className="border-2 w-[324px] h-[48px] rounded-[24px] bg-black text-white ml-10" />

          <p className="text-lg">
            Already have an account? Login{" "}
            <a className="text-green-500" href="./login">here</a>.
          </p>

          {/* Updated Google Sign-in Button */}
          <button
            type="button"
            className="border-2 w-[324px] h-[48px] rounded-[24px] bg-black text-white mx-auto"
            onClick={handleGoogleSignup}
          >
            Continue with Google <i className="fa-brands fa-google"></i>
          </button>
        </form>
      </div>
    );
  };

  export default Signup;
