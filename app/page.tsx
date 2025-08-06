"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const webhookUrl = "https://n8n.aibus.dev/webhook/clone-test-model/0047a97b-8db7-4cf5-9dc5-83abc171e8ae"
interface Message {
    id: string;
    message: string;
    type: "system" | "human";
    timestamp: Date;
    image_urls: string[];
}

export default function MessengerPage() {
    const [messages, setMessages] = useState<Message[]>([
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessageToWebhook = async (allMessages: Message[]) => {
        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: allMessages.map(msg => ({
                        message: msg.message,
                        type: msg.type,
                        image_urls: msg.image_urls
                    }))
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.content) {
                    let processedContent = data.content.replace(/\\n/g, '\n');
                    processedContent = processedContent.replace(/\n{3,}/g, '\n\n');
                    const botResponse: Message = {
                        id: Date.now().toString(),
                        message: processedContent,
                        type: "system",
                        timestamp: new Date(),
                        image_urls: data.attach_files || [],
                    };
                    setMessages(prev => [...prev, botResponse]);
                }
            }
        } catch (error) {
            console.error("Error sending message to webhook:", error);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            message: inputText,
            type: "human",
            timestamp: new Date(),
            image_urls: [],
        };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInputText("");
        setIsLoading(true);

        try {
            await sendMessageToWebhook(updatedMessages);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AZ</span>
                    </div>
                    <div className="flex-1">
                        <h1 className="font-semibold text-base">AZbot Support</h1>
                        <p className="text-xs text-green-500 font-medium">● Online</p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.type === "human" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-2 rounded-lg ${message.type === "human"
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-800 border border-gray-200"
                                }`}
                        >
                            {message.image_urls.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {message.image_urls.map((imageUrl, index) => (
                                        <Image
                                            key={index}
                                            src={imageUrl}
                                            alt={`Message attachment ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className="w-[100px] h-[100px] object-cover rounded"
                                            unoptimized
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="text-sm whitespace-pre-line">{message.message}</div>
                            <p
                                className={`text-xs mt-1 ${message.type === "human" ? "text-blue-100" : "text-gray-500"
                                    }`}
                            >
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={1}
                            style={{ minHeight: "44px", maxHeight: "120px" }}
                        />
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={!inputText.trim() || isLoading}
                        className="h-[50px] bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
