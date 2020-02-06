package com.mycompany.chattserver.endpoints;

import java.io.IOException;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;


@ServerEndpoint("/chatserver")
    public class Endpoint {
        static Set<Session> sessions = new HashSet<>();

@OnOpen
    public void open(Session user) {
            sessions.add(user);
        }

@OnClose
    public void close(Session user) throws IOException {
        String username = (String) user.getUserProperties().get("username");
        sessions.remove(user);
        Iterator<Session> iterator = sessions.iterator();
        while (iterator.hasNext()) {
            Session currentUser = iterator.next();
            currentUser.getBasicRemote()
            .sendText(buildJsonUsers());
            currentUser.getBasicRemote()
            .sendText(buildMessage("system", username + "has left the chatroom!"));
        }
        
            iterator.next().getBasicRemote()
            .sendText(buildJsonUsers());
    }

@OnMessage
    public void onMessage(String message, Session user) throws IOException {
        String username = (String) user.getUserProperties()
        .get("username");

        if (username == null) {
            user.getUserProperties().put("username", message);
            user.getBasicRemote()
            .sendText(buildMessage("system", "Welcome to the chatroom!"));

            Iterator<Session> iterator = sessions.iterator();
            while (iterator.hasNext()) {
            iterator.next().getBasicRemote()
            .sendText(buildJsonUsers());
            }
            
            }else{
            Iterator<Session> iterator = sessions.iterator();
            while(iterator.hasNext()) {
                iterator.next().getBasicRemote()
                .sendText(buildMessage(username, message));
            }
            }   
    }

    private String buildMessage(String from, String message) {
        JsonObject jsonMessage = Json.createObjectBuilder()
        .add("from", from)
        .add("message", message)
        .build();

        return jsonMessage.toString();
    }

    private String buildJsonUsers() {
        JsonArrayBuilder jsonArrayBuiler = Json.createArrayBuilder();
        Iterator<Session> iterator = sessions.iterator();
        while (iterator.hasNext()) {
            String username = (String) iterator.next().getUserProperties().get("username");
            JsonObject jsonUser = Json.createObjectBuilder()
            .add("username", username).build();
            jsonArrayBuiler.add(jsonUser);
        }
        
        return jsonArrayBuiler.build().toString();
    }

}




 /* @author Matteus Psajd */
 