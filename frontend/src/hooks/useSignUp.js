import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { signup } from '../lib/api';

const useSignUp = () => {
 const queryClientClient = useQueryClient();

 const {mutate: signupMutation, isPending, error} = useMutation({
  mutationFn: signup,
  onSuccess: (data) => {
    queryClientClient.invalidateQueries({ queryKey: ["authUser"] });
  },
  onError: (error) => {
    console.error("Signup error:", error);
  },
 })
    return { signupMutation, isPending, error };
}

export default useSignUp

