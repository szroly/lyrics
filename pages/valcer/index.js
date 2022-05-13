import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { Table, Grid, Button, Modal, Segment, Form, Input } from "semantic-ui-react";
import { useRouter } from "next/router";
import style from "./Valcer.module.css";
import { useCookies } from "react-cookie";

export async function getServerSideProps(ctx) {
  const jwtSentByClient = ctx.req.cookies.jwt;


  let response = await axios.get("https://quiet-sierra-12679.herokuapp.com/waltz",{
    headers:{
      Authorization: `Bearer ${jwtSentByClient}`
    }
  });
  let lyrics = await response.data;

  if (response.status != 200) {
    lyrics = false;
  }
  return {
    props: {
      lyrics: lyrics,
    },
  };
}
const Valcer = ({ lyrics }) => {
  const [openModal, setOpenModal] = useState();
  const [waltz, setWaltz] = useState({});
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filteredLyrics, setFilteredLyrics] = useState(lyrics.waltz);
  const [cookies] = useCookies();

 

  useEffect(() => {
    lyrics && setFilteredLyrics(lyrics.waltz.filter((lyric) => lyric.title.toLowerCase().includes(search.toLowerCase())));
  },[search])

  return (
    <div>
      <Navbar />
      <div className={style.inputWrapper}>
      <Input
        icon="search"
        iconPosition="left"
        placeholder="Search..."
        className={style.searchInput}
        onChange={(e) => setSearch(e.target.value)}
      />
      </div>
      
      <Grid textAlign="center">
        <Button
          icon="add"
          floated="right"
          size="medium"
          style={{backgroundColor : "rgb(3, 123, 252)", color : "white"}}
          onClick={
            () => setOpenModal(true)
          }
        />
          <div
            style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.3rem",
            }}
          >
            <Table compact striped selectable fixed>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">Title</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  filteredLyrics.map((waltz) => {
                    return (
                      <Table.Row 
                        key={waltz.id} 
                        style={{ cursor: "pointer" }}
                        onClick={() => router.push(`/valcer/${waltz._id}`)}
                        >
                        <Table.Cell textAlign="center">
                          {waltz.title}
                        </Table.Cell>
                      </Table.Row>
                    );
                })}
              </Table.Body>
            </Table>
          </div>
      </Grid>
      <Modal
        size="large"
        open={openModal}
        onClose={ () => setOpenModal(false) }
        style={{height : "90%"}}
      >
        <Segment>
          <Form>
            <Form.Input
              label="Cim"
              size="mini"
              name="title"
              required
              value={waltz.title || ""}
              onChange={
                ( e, { value } ) => setWaltz({ ...waltz, title : value})
              }

            />

            <Form.TextArea
              label="Szoveg"
              style={{height : "65vh"}}
              name="text"
              required
              value={waltz.text || ""}
              onChange={
                ( e, { value } ) => setWaltz({ ...waltz, text : value})
              }
            />
              <Button
              label="Mentes"
              icon="save"
              size="medium"
              onClick={
                () => {
                  async function postLyrics() {
                    return await fetch("https://quiet-sierra-12679.herokuapp.com/waltz", {
                      method: "POST",
  
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookies.jwt}`,
                      },
                      body: JSON.stringify(waltz),
                    })
                      .then((response) => {
                        if (response.ok) {
                          setOpenModal(false);
                          router.reload(window.location.pathname);
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                postLyrics();
                }
              }
              />
              <Button
                label="Kilepes"
                icon="close"
                size="medium"
                onClick={
                  () => setOpenModal(false)
                }
              />
            </Form>
        </Segment>
      </Modal>
    </div>
  );
};

export default Valcer;
