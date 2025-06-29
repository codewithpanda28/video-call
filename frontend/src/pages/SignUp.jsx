import React from "react";
import { ShipWheel } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { signup } from "../lib/api";

const SignUp = () => {
  const [signupdata, setsignupdata] = React.useState({
    fullName: "",
    email: "",
    password: "",
    termsAndConditions: false,
  });
  

  const queryClient = useQueryClient();
  const navigate = useNavigate();


  const {mutate, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (error) => {
      console.error("Signup error:", error);
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupdata.termsAndConditions) {
      mutate(signupdata);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* signup form - left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo */}
          <div className="mb-8 flex items-center  gap-2">
            <ShipWheel className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4 ">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join Streamify and start your language learning adventure!
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text ">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="input input-bordered w-full"
                      value={signupdata.fullName}
                      onChange={(e) =>
                        setsignupdata({
                          ...signupdata,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* Email */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text ">Email</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your email"
                      className="input input-bordered w-full"
                      value={signupdata.email}
                      onChange={(e) =>
                        setsignupdata({
                          ...signupdata,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* Password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text ">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="input input-bordered w-full"
                      value={signupdata.password}
                      onChange={(e) =>
                        setsignupdata({
                          ...signupdata,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs mt-2 opacity-70">
                      Password should be at least 6 characters
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        onChange={(e) =>
                          setsignupdata({
                            ...signupdata,
                            termsAndConditions: e.target.checked,
                          })
                        }
                        required
                      />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className=" text-primary hover:underline">
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline">
                          Privacy Policy
                        </span>{" "}
                      </span>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary w-full" type="submit">
                 {isPending ? "Signing Up..." : " Create Account"  }
                </button>

                {error && (
                  <div className="alert alert-error">
                    <span>{error?.response?.data?.message || "Signup failed. Please try again."}</span>
                  </div>
                )}

                <div className="text-center mt-4">
                  <p className="text-sm ">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-primary hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* signup form - right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration "
                className="w-full h-full"
              />
            </div>

            <div className="text-center mt-6 space-y-3">
              <h2 className="text-xl font-semibold ">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice speaking with native speakers and improve your language skills through real conversations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

