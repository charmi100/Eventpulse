'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  const handleSubmit = async (e:any)=>{
    e.preventDefault();
    setLoading(true);

    if(password!==confirmPassword){
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try{
      const res=await fetch('https://eventpulse-backend-b9ld.onrender.com/api/auth/register',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,email,password})
      });

      const data=await res.json();

      if(!res.ok){
        setError(data.message);
        setLoading(false);
        return;
      }

      login(data.token,data.user);
      router.push('/');
    }catch{
      setError('Server error');
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        body { margin:0; font-family:sans-serif; background:#060608; }

        .container {
          display:flex;
          height:100vh;
        }

        .left {
          flex:1;
          display:flex;
          flex-direction:column;
          justify-content:center;
          padding:60px;
          background:linear-gradient(135deg,#1a0f2e,#000);
          color:white;
        }

        .left h1 {
          font-size:48px;
          margin-bottom:20px;
        }

        .right {
          flex:1;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .form {
          width:320px;
          color:white;
        }

        input {
          width:100%;
          padding:12px;
          margin-top:10px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,0.1);
          background:#111;
          color:white;
        }

        button {
          width:100%;
          margin-top:15px;
          padding:12px;
          border:none;
          border-radius:8px;
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          color:white;
          cursor:pointer;
        }

        .error {
          background:#ff4d4d22;
          padding:10px;
          margin-bottom:10px;
          border-radius:6px;
          color:#ff6b6b;
        }

        a { color:#7c3aed; }
      `}</style>

      <div className="container">

        <div className="left">
          <h1>Join EventPulse</h1>
          <p>Explore events happening around you in real-time.</p>
        </div>

        <div className="right">
          <div className="form">

            <h2>Create Account</h2>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
              <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
              <button>{loading ? 'Creating...' : 'Sign Up →'}</button>
            </form>

            <p style={{marginTop:'10px'}}>
              Already have account? <a href="/login">Login</a>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}