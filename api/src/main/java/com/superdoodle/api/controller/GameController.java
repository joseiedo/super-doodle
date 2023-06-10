package com.superdoodle.api.controller;


import com.superdoodle.api.controller.request.MovePlayerRequest;
import com.superdoodle.api.model.Game;
import com.superdoodle.api.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.messaging.*;

@RestController
@CrossOrigin("*")
public class GameController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private final Game game = new Game();

    @MessageMapping("/join")
    public Player joinGame(StompHeaderAccessor headerAccessor) {
        Player player = Player.builder()
                .id(headerAccessor.getSessionId())
                .positionX(0)
                .positionY(0)
                .build();

        game.addPlayer(player);
        simpMessagingTemplate.convertAndSend("/game/current", game);
        return player;
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        game.getPlayers().removeIf(p -> p.getId().equals(sessionId));
        simpMessagingTemplate.convertAndSend("/game/current", game);

    }
    @MessageMapping("/movecurrentplayer")
    public void movePlayer(StompHeaderAccessor headerAccessor, MovePlayerRequest player) {
        String sessionId = headerAccessor.getSessionId();
        final int step = 10;

        game.getPlayers().stream()
                .filter(p -> p.getId().equals(sessionId))
                .findFirst()
                .ifPresent(p -> {
                    switch (player.getDirection()) {
                        case UP -> p.setPositionY(p.getPositionY() - step);
                        case DOWN -> p.setPositionY(p.getPositionY() + step);
                        case LEFT -> p.setPositionX(p.getPositionX() - step);
                        case RIGHT -> p.setPositionX(p.getPositionX() + step);
                    }
                });

        simpMessagingTemplate.convertAndSend("/game/current", game);
    }

}
