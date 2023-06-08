package com.superdoodle.api.controller;


import com.superdoodle.api.controller.request.MovePlayerRequest;
import com.superdoodle.api.enums.Direction;
import com.superdoodle.api.model.Game;
import com.superdoodle.api.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import static com.superdoodle.api.enums.Direction.UP;

@RestController
@CrossOrigin("*")
public class GameController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    private final Game game = new Game();
    private static final int step = 10;

    @PostMapping("/join")
    public Player joinGame() {
        Player player = Player.builder()
                .id(game.getPlayers().size() + 1L)
                .positionX(0)
                .positionY(0)
                .build();

        game.addPlayer(player);
        simpMessagingTemplate.convertAndSend("/game/current", game);
        return player;
    }

//    @
//    public void leaveGame(@PathVariable Long id) {
//        game.getPlayers().removeIf(p -> p.getId().equals(id));
//        simpMessagingTemplate.convertAndSend("/game/current", game);
//    }

    @MessageMapping("/movecurrentplayer")
    public void movePlayer(MovePlayerRequest player) {

        game.getPlayers().stream()
                .filter(p -> p.getId().equals(player.getId()))
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
