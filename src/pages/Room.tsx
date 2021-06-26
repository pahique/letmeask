import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";
import logoImg from "../assets/images/logo.svg";

import { RoomCode } from "../components/RoomCode";

import '../styles/room.scss';
import { database } from "../services/firebase";

type RoomParams = {
    id: string;
}

type FirebaseQuestions = Record<string, Question>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
        roomRef.on("value", room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            //const firebaseQuestions = databaseRoom.questions ?? {} as FirebaseQuestions;
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    author: value.author,
                    content: value.content,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted
                }
            });
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
    }, [roomId]);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();
        if (newQuestion.trim() === '') {
            return;
        }
        
        if (!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);
        setNewQuestion('');
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask"/>
                    <RoomCode code={roomId}/>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}/>
                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name}/>
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                    {JSON.stringify(questions)}
                </form>
            </main>
        </div>
    );
}