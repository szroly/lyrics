import axios from "axios";
import { useState } from "react";
import { Button, Form, Grid, Message, Segment } from "semantic-ui-react";
import style from "./Login.module.css";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies();
  const [error, setError] = useState({});
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://quiet-sierra-12679.herokuapp.com/login", {
        username,
        password,
      });
      // console.log("RESPONSE",response)
      setCookie("jwt", response.data.token);
      router.push("/csardas");
    } catch (error) {
      // console.log("error", error);
      setError(error.response.data)
    }

    console.log("cookie", cookie);
  };

  return (
    <>
      <h1
        className={style.logo}
        style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
      >
        Lyrics App
      </h1>
      <Grid centered>
        <Grid.Column computer={4} mobile={13}>
          <Form style={{ border: "1px solid green", padding: "2rem" }}>
            {error.msg && <Message negative>{error.msg}</Message>}
            <Form.Input
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Input
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button primary content="Login" fluid onClick={handleLogin} />
          </Form>
        </Grid.Column>
      </Grid>
      <h5 style={{ textAlign: "center" }}>Ver. 1.0 by Roli</h5>
    </>
  );
};

export default Login;
