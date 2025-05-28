import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import React from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({username, password}));
  }

  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Sign in ILSNX</h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="username"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="label cursor-pointer">
                <input type="checkbox" className="checkbox" />
                <span className="label-text ml-2">Remember Me</span>
              </label>
              <a href="#" className="link link-primary">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
disabled={loading}
            >
{loading ? <span className="loading loading-spinner loading-sm"></span> : 'Sign in'}
            </button>
          </form>

          <div className="divider">or</div>

          <div className="flex flex-col space-y-2">
            <button className="btn btn-outline">Sign in with Google</button>
            <button className="btn btn-outline">Sign in with LinkedIn</button>
            <button className="btn btn-outline">Sign in with GitHub</button>
          </div>

          <div className="text-center">
            <span>New to ILSNX? </span>
            <a href="/register" className="link link-primary">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
