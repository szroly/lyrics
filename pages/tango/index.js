import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { Button, Table, Grid, Modal, Form, Segment, Input } from "semantic-ui-react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import style from "./Tango.module.css";

export async function getServerSideProps(ctx) {
  const jwtSentByClient = ctx.req.cookies.jwt;


  let response = await axios.get("https://quiet-sierra-12679.herokuapp.com/tango",{
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

const Tango = ({ lyrics }) => {
  const [openModal, setOpenModal] = useState();
  const [tango, setTango] = useState({});
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filteredLyrics, setFilteredLyrics] = useState(lyrics.tango);
  const [cookies] = useCookies();

  

  useEffect(() => {
    lyrics && setFilteredLyrics(lyrics.tango.filter((lyric) => lyric.title.toLowerCase().includes(search.toLowerCase())));
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
            {filteredLyrics.map((tango,i) => {
              return (
                <Table.Row 
                  key={i} 
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/tango/${tango._id}`)}
                  >
                  <Table.Cell textAlign="center">{tango.title}</Table.Cell>
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
            value={tango.title || ""}
            onChange={
              ( e, { value } ) => setTango({ ...tango, title : value})
            }

          />

          <Form.TextArea
            label="Szoveg"
            style={{height : "65vh"}}
            name="text"
            required
            value={tango.text || ""}
            onChange={
              ( e, { value } ) => setTango({ ...tango, text : value})
            }
          />
          <Button
            label="Mentes"
            icon="save"
            size="medium"
            onClick={
              () => {
                async function postLyrics() {
                  return await fetch("https://quiet-sierra-12679.herokuapp.com/tango", {
                    method: "POST",

                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${cookies.jwt}`,
                    },
                    body: JSON.stringify(tango),
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

export default Tango;
