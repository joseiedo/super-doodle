package com.superdoodle.api.controller;


import com.superdoodle.api.model.Game;
import com.superdoodle.api.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class GameController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    private final Game game = Game.builder()
            .Id(1L)
            .players(List.of(
                    Player.builder()
                            .id(1L)
                            .positionX(30)
                            .positionY(20)
                            .build()
            ))
            .build();


    @MessageMapping("/join")
    public void joinGame() {
        simpMessagingTemplate.convertAndSend("/game/current", game);
    }
//
//    @MessageMapping("/movecurrentplayer")
//    public void movePlayer(@Payload Player player) {
//
//        game.getPlayers().stream()
//                .filter(p -> p.getId().equals(player.getId()))
//                .findFirst()
//                .ifPresent(p -> {
//                    p.setPositionX(player.getPositionX());
//                    p.setPositionY(player.getPositionY());
//                });
//
//        simpMessagingTemplate.convertAndSend("/game/current", game);
//    }
}
