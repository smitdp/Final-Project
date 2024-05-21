import './ChatBot.scss';
import React, { useContext, useEffect, useState } from 'react'
import getCurrentUserId from '../../utils/getCurrentUserId';
import { useUserInfo } from '../../utils/useUserInfo';
import { useNavigate } from 'react-router-dom';
import ChatBot1 from "../../assets/Images/ChatBot1.png";


const ChatBot = () => {
    const userId = getCurrentUserId();
    const information = useUserInfo(userId);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);

    function hasSynonymOrTense(wordToCheck, sentence) {
        const word = wordToCheck.toLowerCase();
        const wordRegex = new RegExp(`\\b${word}\\b|\\b${word}s?\\b|\\b${word}ed\\b|\\b${word}ing\\b`, 'i');
        return wordRegex.test(sentence);
    };

    useEffect(() => {
        const newMessages = [...messages, { type: 'bot', text: 'Hey, I am SureBot!' }];
        setMessages(newMessages);
        setMessages([...newMessages, { type: 'bot', text: 'How may I help you today?' }]);
    }, []);

    const handleMessageSubmit = () => {
        const userInput = document.getElementById('user-input').value;
        if (userInput.length < 1) {
            return;
        }

        const newMessages = [...messages, { type: 'user', text: userInput }];
        setMessages(newMessages);

        if (hasSynonymOrTense('Buy', userInput) || hasSynonymOrTense('Suggest', userInput) || hasSynonymOrTense('Offer', userInput)) {
            setMessages([...newMessages, { type: 'bot', text: 'Sure. I am redirecting you to the policy page. Here you can browse and choose your desired policy.' }]);
            setTimeout(() => {
                navigate("/policies")
            }, 5000);
        } else if (hasSynonymOrTense('Customer', userInput)) {
            setMessages([...newMessages, { type: 'bot', text: 'We understand your concern ' + information.information.firstName + '. You will shortly receive a call from one of our customer service executives. If +91-' + information.information.phoneNumber + ' is not your number currently, please update it in your profile section.' }]);
        } else if (hasSynonymOrTense('Claim', userInput) || hasSynonymOrTense('Apply', userInput) || hasSynonymOrTense('Appli', userInput)) {
            setMessages([...newMessages, { type: 'bot', text: 'We hope our customers never have to claim policies. We are sorry for the loss you had ' + information.information.firstName + '. We are with you in this difficult situation. I will redirect you to your all bought policies from where you can claim your policies seamlessly.' }]);
            setTimeout(() => {
                navigate("/my-policies");
            }, 5000);
        } else {
            setMessages([...newMessages, { type: 'bot', text: 'Sorry, I take limited commands for now. New Version 2.0 is coming soon!' }]);
        }

        document.getElementById('user-input').value = '';
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleMessageSubmit();
        }
    };

    return (
        <div className='main-container-bot'>
           

            <div className="chatbot-container">
                <div className="chatbot-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={message.type}>
                            <span>{message.text}</span>
                        </div>
                    ))}
                </div>
                <div className="chatbot-input">
                    <input autofocus autoComplete="off" placeholder="Write here..." type="text" id="user-input" onKeyPress={handleKeyPress} />
                    <button onClick={handleMessageSubmit}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatBot;

