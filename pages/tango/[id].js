import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Grid, Modal } from "semantic-ui-react";
import { useCookies } from "react-cookie";


export function getServerSideProps(context) {
    return {
        props: { params: context.params }
    };
}

const Tango = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [tango, setTango] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [cookies] = useCookies();



    useEffect(() => {
        async function fetchTango(){
            const resp = await axios.get(`https://quiet-sierra-12679.herokuapp.com/tango/${id}`,{
                headers: {
                    Authorization: `Bearer ${cookies.jwt}`
                  }
            })
            setTango(resp.data.tango);
        }

        fetchTango();
    },[])

    
    return(
        <>
        <Button
                content="Vissza"
                icon="arrow alternate circle left"
                style={{ backgroundColor : "rgb(3, 123, 252)", color : " white", margin : "10px"}}
                onClick={ () => router.back()}
            />
            <Button
                content="Törlés"
                icon="trash"
                style={{ backgroundColor : "rgb(3, 123, 252)", color : " white", margin : "10px"}}
                onClick={() => setOpenModal(true)}

            />

            <Modal
                open={openModal}
                closeOnEscape={true}
                closeOnDimmerClick={true}
                onOpen={() => setOpenModal(true)}
                onClose={() => setOpenModal(false)}
            >
                <Modal.Header>
                    Szöveg törlése
                </Modal.Header>
                <Modal.Content>
                    Biztos törölni szeretné a megnyitott szöveget?
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content="Nem"
                        style={{ backgroundColor : "rgb(3, 123, 252)", color : " white", margin : "10px"}}
                        onClick={() => setOpenModal(false)}
                    />
                    <Button
                        content="Igen"
                        style={{ backgroundColor : "rgb(3, 123, 252)", color : " white", margin : "10px"}}
                        onClick={() => {
                        async function deleteText(){
                            const resp = await axios.delete(`https://quiet-sierra-12679.herokuapp.com/tango/${id}`, {
                                headers:{
                                    Authorization: `Bearer ${cookies.jwt}`
                                  }
                            });
                            
                            if(resp.status = 200){
                                setOpenModal(false)
                                router.push(`/tango`)
                            }
                        }

                        deleteText()
                        }}
                    />
                </Modal.Actions>
            </Modal>
            <Grid>
                <Grid.Row>
                    <Grid.Column textAlign="center">

                        <h2>{tango.title}</h2>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <p style={{ whiteSpace: "pre-line" }}>{tango.text}</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    )
}
export default Tango;