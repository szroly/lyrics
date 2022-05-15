import { Segment, Icon, Grid, Popup } from "semantic-ui-react";
import style from "../styles/Navbar.module.css";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useState } from "react";
import axios from "axios";

const Navbar = () => {
  const router = useRouter();
  const [cookie, setCookie, removeCookie] = useCookies();
  const [navbarVisible, setNavbarVisible] = useState(false);

 const user = cookie.username;
console.log('cookie', cookie)

  return (
    <Segment>
      <h1
        className={style.logo}
        style={{ display: "flex", justifyContent: "center" }}
      >
        Lyrics App
      </h1>
      <Grid className={style.container}>
        <Grid.Row only="computer">
        <Grid.Column width={6}></Grid.Column>
        <Grid.Column width={8}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                borderBottom:
                  router.pathname == "/csardas" ? "1px solid white" : "initial",
              }}
              onClick={() => {
                router.push(`/csardas`);
              }}
              className={style.menuItem}
            >
              CSÁRDÁS
            </div>
            <div
              style={{
                borderBottom:
                  router.pathname == "/tango" ? "1px solid white" : "initial",
              }}
              onClick={() => {
                router.push(`/tango`);
              }}
              className={style.menuItem}
            >
              TANGÓ
            </div>

            <div
              style={{
                borderBottom:
                  router.pathname == "/valcer" ? "1px solid white" : "initial",
              }}
              onClick={() => {
                router.push(`/valcer`);
              }}
              className={style.menuItem}
            >
              KERINGŐ
            </div>

            <div
              style={{
                borderBottom:
                  router.pathname == "/rock" ? "1px solid white" : "initial",
              }}
              onClick={() => {
                router.push(`/rock`);
              }}
              className={style.menuItem}
            >
              ROCK
            </div>

            <div
              style={{
                borderBottom:
                  router.pathname == "/szerb" ? "1px solid white" : "initial",
              }}
              onClick={() => {
                router.push(`/szerb`);
              }}
              className={style.menuItem}
            >
              SZERB
            </div>

            <div
              style={{
                borderBottom:
                  router.pathname == "/egyeb" ? "1px solid white" : "initial",
              }}
              onClick={() => {
                router.push(`/egyeb`);
              }}
              className={style.menuItem}
            >
              EGYÉB
            </div>

          </div>
        </Grid.Column>
        <Grid.Column width={2}>
          <div style={{ display: "flex" }}>
            <p style={{color: "white", fontSize: "1.2rem"}}>{user}</p>
            <Popup
              trigger={<Icon
                name="sign-out"
                size="large"
                style={{ color: "white", marginLeft: "1rem", cursor: "pointer" }}
                onClick={() => {
                  async function logoutUser(){
                    return await fetch("https://quiet-sierra-12679.herokuapp.com/logout", {
                      method: "POST",
  
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookie.jwt}`,
                      }
                      
                    })
                      .then((response) => {
                        if (response.ok) {
                         router.push('/login')
                         removeCookie('jwt')
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                 logoutUser();
                }
              }
  
              />}
              content="Kijelentkezés"
            />
            
          </div>

        </Grid.Column>
        </Grid.Row>
        <Grid.Row only="mobile" width={16}>
          <Grid.Column>
            {
              !navbarVisible && (
                <div>
                  <Icon
                    name="bars"
                    size="large"
                    style={{ color: "white", cursor: "pointer" }}
                    onClick={() => setNavbarVisible(!navbarVisible)}
                  />
                </div>
              )
            }
                {
                  navbarVisible && (
                    <div>
                      <Icon
                        name="close"
                        size="large"
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={() => setNavbarVisible(!navbarVisible)}
                      />
                    </div>
                  )
                }
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only="mobile" width={16}>
          <Grid.Column>
            {
              navbarVisible && (
                <div className={style.mobile_menu}>
                <div 
                  className={style.mobile_menu_item}
                  onClick={() => {
                  router.push(`/csardas`);
                  setNavbarVisible(!navbarVisible);
                }}
                >
                  CSÁRDÁS
                </div>
                <div 
                  classname={style.mobile_menu_item}
                  onClick={() => {
                  router.push(`/tango`);
                  setNavbarVisible(!navbarVisible);
                }
                  }
                  >
                  TANGÓ
              </div>
              <div 
                classname={style.mobile_menu_item}
                onClick={() => {
                  router.push(`/valcer`);
                  setNavbarVisible(!navbarVisible);
                }}
                >
                  KERINGŐ
              </div>
              <div 
                classname={style.mobile_menu_item}
                onClick={() => {
                  router.push(`/rock`);
                  setNavbarVisible(!navbarVisible);
                }} 
              >
                  ROCK
              </div>
              <div 
                classname={style.mobile_menu_item}
                onClick={() => {
                  router.push(`/szerb`);
                  setNavbarVisible(!navbarVisible);
                }}
              >
                  SZERB
              </div>
              <div 
                classname={style.mobile_menu_item}
                onClick={() => {
                  router.push(`/egyeb`);
                  setNavbarVisible(!navbarVisible);
                }}
              >
                  EGYÉB
              </div>
              <div>
              
                <Icon
                  name="sign-out"
                  size="large"
                  onClick={() => {
                    setNavbarVisible(!navbarVisible);
                    router.push(`/`);
                  }
                }
                />
              </div>
              </div>
              )
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default Navbar;
