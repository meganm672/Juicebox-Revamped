import { useState } from "react";
import { Stack, Button, Paper, TextField, Typography, Link } from "@mui/material";

const Login = ({setToken}) => {
  
     // should be either login or register, to match the API routes
     const [type, setType] = useState("login");
     // form fields
     const [fullName, setFullName] = useState("");
     const [location, setLocation] = useState("");
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");
     const [repeatPassword, setRepeatPassword] = useState("");
    const  [error, setError] = useState(null);
  


    const handleSubmit = async (event) => {

    event.preventDefault();

    if (type === "register") {
        try{
            const response = await fetch('http://localhost:3000/api/users/register',{
                method: "POST",
                data: JSON.stringify({fullName, location, username, password})
            })
            const data = await response.json();
            console.log(data);
            setToken(data.token);
        }catch (e){
            setError(e.message)
        }

    }

    if (type === "login") {
        try{
            const response = await fetch('http://localhost:3000/api/users/login',{
                method: "POST",
                data: JSON.stringify({username, password})
            })
            const data = await response.json();
            console.log(data);
            setToken(data.token)
        }catch (e){
            setError(e.message)
        };

    }

}
return (
    <Paper elevation={6} sx={{width: "50%", padding: 4, margin: "14px auto"}}>
        <form onSubmit={handleSubmit}>
            <Stack direction="column">
                <Typography
                    variant="h5"
                    sx={{textAlign: "center"}}
                >
                    {type === "login" ? "Log In" : "Register"}
                </Typography>
                {type === "register" && <TextField
                    label="Full Name"
                    onChange={e => setFullName(e.target.value)}
                    value={fullName}
                    sx={{margin: "8px 0"}}
                    />}
                {type === "register" && <TextField
                    label="Location"
                    onChange={e => setLocation(e.target.value)}
                    value={location}
                    sx={{margin: "8px 0"}}
                    />}
                <TextField
                    label="Username"
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                    sx={{margin: "8px 0"}}
                    />

                <TextField
                    label="Password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    sx={{margin: "8px 0"}}
                    type="password"
                    />
                    {type === "register" && <TextField
                        label="Re-Enter Password"
                        onChange={e => setRepeatPassword(e.target.value)}
                        value={repeatPassword}
                        type="password"
                        sx={{margin: "8px 0"}}
                        error={!!(password && repeatPassword && password !== repeatPassword)}
                        helperText={password && repeatPassword && password !== repeatPassword ? "Password must match" : null}
                    />}
                </Stack>
                <Button
                    variant="contained"
                    size="large"
                    sx={{margin: "8px 0", width: "100%"}}
                    type="submit"
                >
                    {type === "login" ? "Log In" : "Register"}
                </Button>
                {type === "login"
                    ? (
                        <Typography>Need to create an account?{" "}
                        <Link href="#" onClick={() => setType("register")}>
                            Register</Link>
                        </Typography>
                    ): (
                        <Typography>Already have an account?{" "}
                        <Link href="#" onClick={() => setType("login")}>
                            Log In</Link>
                        </Typography>
                    )
                }
        </form>
    </Paper>
);
}

export default Login