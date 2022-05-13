import { useEffect, useState } from "react";
import { Table, Grid, Button, Modal, Segment, Form, Input } from "semantic-ui-react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import style from "./Szerb.module.css";

export async function getServerSideProps(ctx) {
  const jwtSentByClient = ctx.req.cookies.jwt;

  let response = await axios.get("https://quiet-sierra-12679.herokuapp.com/szerb",{
    headers: {
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
const Szerb = ({ lyrics }) => {
  const [openModal, setOpenModal] = useState();
  const [szerb, setSzerb] = useState({});
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filteredLyrics, setFilteredLyrics] = useState(lyrics.szerb);
  const [cookies] = useCookies();

 

  useEffect(() => {
    lyrics && setFilteredLyrics(lyrics.szerb.filter((lyric) => lyric.title.toLowerCase().includes(search.toLowerCase())));
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
          style={{backgroundColor : "rgb(13, 123, 252)", color : "white"}}
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
                
                {  filteredLyrics.map((szerb) => {
                    return (
                      <Table.Row 
                      key={szerb._id} 
                      style={{ cursor: "pointer" }}
                      onClick={() => router.push(`/szerb/${szerb._id}`)}
                      >
                        <Table.Cell textAlign="center">
                          {szerb.title}
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
              value={szerb.title || ""}
              onChange={
                ( e, { value } ) => setSzerb({ ...szerb, title : value})
              }

            />

            <Form.TextArea
              label="Szoveg"
              style={{height : "65vh"}}
              name="text"
              required
              value={szerb.text || ""}
              onChange={
                ( e, { value } ) => setSzerb({ ...szerb, text : value})
              }
            />
              <Button
              label="Mentes"
              icon="save"
              size="medium"
              onClick={
                () => {
                  async function postLyrics() {
                    return await fetch("https://quiet-sierra-12679.herokuapp.com/szerb", {
                      method: "POST",
  
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookies.jwt}`,
                      },
                      body: JSON.stringify(szerb),
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

export default Szerb;
