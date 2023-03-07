import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "react-bootstrap";
import Ticket from "./Ticket";

export default function TicketBoard(props) {

    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const [tickets, setTickets] = useState([]);

    const bodyContainsSwearWord = useMemo(() => {
        console.log("I checked for bad words!")
        return newContent.toLowerCase().includes("frik")
    }, [newContent]);

    const loadTickets = useCallback(() => {
        fetch('https://cs571.org/s23/week6/api/tickets', {
            headers: {
                "X-CS571-ID": "ENTER_YOUR_BID"
            }
        })
            .then(res => res.json())
            .then(json => {
                setTickets(json.messages);
            })
    }, [setTickets]);

    useEffect(loadTickets, [loadTickets])

    const createTicket = useCallback((nTitle, nContent) => {
        fetch('https://cs571.org/s23/week6/api/tickets', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "ENTER_YOUR_BID"
            },
            body: JSON.stringify({
                title: nTitle,
                content: nContent
            })
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error()
            }
        }).then(json => {
            console.log("Recieved back...");
            console.log(json);
            alert('Successfully made ticket!')
            loadTickets();
        }).catch(e => {
            alert('An error occured while making the request')
        })
    }, [loadTickets]);

    return <div>
        <h1>Ticket Board</h1>
        <p>Create a ticket...</p>
        <form>
            <label htmlFor="title">Title</label>
            <input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <label htmlFor="content">Content</label>
            <input id="content" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
        </form>
        <Button
            onClick={() => createTicket(newTitle, newContent)}
            style={{ marginTop: "1rem" }}
            disabled={bodyContainsSwearWord}
        >Create a Ticket</Button>
        <hr />
        {
            tickets.map(t => <Ticket key={t.id} {...t} />)
        }
    </div>
}