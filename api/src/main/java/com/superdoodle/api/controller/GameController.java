package com.superdoodle.api.controller;


import com.superdoodle.api.controller.request.MovePlayerRequest;
import com.superdoodle.api.model.Fruit;
import com.superdoodle.api.model.Game;
import com.superdoodle.api.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.messaging.*;

import java.util.Objects;

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
                .points(0)
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
    public void movePlayer(StompHeaderAccessor headerAccessor, MovePlayerRequest request) {
        String sessionId = headerAccessor.getSessionId();
        final int step = 10;

        game.getPlayers().stream()
                .filter(player -> player.getId().equals(sessionId))
                .findFirst()
                .ifPresent(player -> {
                    switch (request.getDirection()) {
                        case UP -> player.setPositionY(player.getPositionY() - step);
                        case DOWN -> player.setPositionY(player.getPositionY() + step);
                        case LEFT -> player.setPositionX(player.getPositionX() - step);
                        case RIGHT -> player.setPositionX(player.getPositionX() + step);
                    }

                    checkIfGotFruit(player);
                });


        simpMessagingTemplate.convertAndSend("/game/current", game);
    }

    private void checkIfGotFruit(Player player){
        boolean isClose = Math.abs(player.getPositionX() - game.getFruit().getPositionX()) < 10
                && Math.abs(player.getPositionY() - game.getFruit().getPositionY()) < 10;

        if(isClose){
            game.setFruit(new Fruit(game));
            player.setPoints(player.getPoints() + 1);
        }
    }
}
