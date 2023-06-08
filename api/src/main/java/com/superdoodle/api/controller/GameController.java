package com.superdoodle.api.controller;


import com.superdoodle.api.controller.request.MovePlayerRequest;
import com.superdoodle.api.model.Game;
import com.superdoodle.api.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class GameController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    private final Game game = new Game();

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


    @MessageMapping("/movecurrentplayer")
    public void movePlayer(MovePlayerRequest player) {

        game.getPlayers().stream()
                .filter(p -> p.getId().equals(player.getId()))
                .findFirst()
                .ifPresent(p -> {
                    p.setPositionX(player.getPositionX());
                    p.setPositionY(player.getPositionY());
                });

        simpMessagingTemplate.convertAndSend("/game/current", game);
        simpMessagingTemplate.convertAndSend("/game/player/" + player.getId(), player);
    }

}
